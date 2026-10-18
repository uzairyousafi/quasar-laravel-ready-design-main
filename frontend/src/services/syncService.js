/**
 * SyncService — pushes queued offline mutations to the server
 * and pulls fresh data into the local IndexedDB cache.
 *
 * Usage:
 *   import { syncService } from '@/services/syncService'
 *   syncService.start()   // called once on app mount when online
 *   syncService.sync()    // manual trigger
 */
import { api } from '@/boot/axios'
import { db, seedTable, getPendingQueue, dequeueSync, pendingCount } from './localDb'
import { reactive } from 'vue'

// Reactive state exposed to components via useSyncStatus()
export const syncState = reactive({
  isOnline: navigator.onLine,
  isSyncing: false,
  pendingCount: 0,
  lastSyncAt: null,
  lastError: null,
})

// Tables to pull from server on sync (in order). Phase 2 modules will add
// their own entries here (items, ledgers, etc.) once those tables exist.
const PULL_TABLES = [
  { endpoint: '/branches', table: 'branches', params: {} },
]

// Endpoint map for push operations — no offline-writable resources yet
const PUSH_ENDPOINTS = {
  branches: { create: 'POST /branches', update: 'PUT /branches', delete: 'DELETE /branches' },
}

let _timer = null

export const syncService = {
  /**
   * Start online/offline listeners and auto-sync every 30s when online.
   */
  start() {
    window.addEventListener('online',  () => { syncState.isOnline = true;  this.sync() })
    window.addEventListener('offline', () => { syncState.isOnline = false })
    syncState.isOnline = navigator.onLine

    // Auto-sync every 30 seconds
    _timer = setInterval(() => { if (syncState.isOnline) this.sync() }, 30_000)

    // Initial sync if online
    if (syncState.isOnline) {
      setTimeout(() => this.sync(), 2000) // slight delay for auth to settle
    }
  },

  stop() {
    if (_timer) clearInterval(_timer)
  },

  /**
   * Full sync cycle: push queued mutations → pull fresh data.
   */
  async sync() {
    if (syncState.isSyncing || !syncState.isOnline) return
    syncState.isSyncing = true
    syncState.lastError = null

    try {
      await this._pushQueue()
      await this._pullAll()
      syncState.lastSyncAt = new Date()
      syncState.pendingCount = await pendingCount()
    } catch (err) {
      syncState.lastError = err?.response?.data?.message || err?.message || 'Sync failed'
      console.warn('[SyncService] Sync error:', err)
    } finally {
      syncState.isSyncing = false
    }
  },

  /**
   * Replay all queued offline mutations against the server.
   */
  async _pushQueue() {
    const queue = await getPendingQueue()
    for (const entry of queue) {
      try {
        const [method, path] = this._resolveEndpoint(entry)
        await api({ method, url: path, data: entry.payload })
        await dequeueSync(entry.id)
      } catch (err) {
        // Increment attempts; stop retrying after 5 failures
        await db.syncQueue.update(entry.id, { attempts: (entry.attempts || 0) + 1 })
        if ((entry.attempts || 0) >= 5) {
          await dequeueSync(entry.id) // give up
        }
        console.warn('[SyncService] Push failed for', entry, err)
      }
    }
  },

  /**
   * Pull reference data from server into local IndexedDB.
   */
  async _pullAll() {
    for (const { endpoint, table, params } of PULL_TABLES) {
      try {
        const { data } = await api.get(endpoint, { params })
        const rows = Array.isArray(data) ? data : (data.data ?? [])
        await seedTable(table, rows)
      } catch (_) {
        // Non-fatal — local cache may already have data
      }
    }
  },

  _resolveEndpoint(entry) {
    const map = PUSH_ENDPOINTS[entry.table]
    const key = entry.operation // 'create' | 'update' | 'delete'
    const str = map?.[key] || `POST /${entry.table}`
    const [method, path] = str.split(' ')
    const url = entry.recordId ? `${path}/${entry.recordId}` : path
    return [method.toLowerCase(), url]
  },
}

/**
 * Composable for components to read sync state.
 */
export function useSyncStatus() {
  return syncState
}
