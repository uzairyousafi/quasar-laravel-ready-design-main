/**
 * offlineApi — wraps the axios `api` instance.
 * When online: pass through to server normally.
 * When offline: serve GET from IndexedDB cache, queue POST/PUT/DELETE mutations.
 *
 * Usage: replace `import { api } from '@/boot/axios'`
 *        with   `import { offlineApi as api } from '@/services/offlineApi'`
 * in components that need offline support.
 */
import { api } from '@/boot/axios'
import { syncState } from './syncService'
import { getLocal, enqueueSync, db } from './localDb'

// Map endpoint prefixes to local DB table names. Phase 2 modules add their
// own entries here as they introduce cacheable resources.
const ENDPOINT_TABLE_MAP = {
  '/branches': 'branches',
}

function tableForUrl(url = '') {
  const clean = url.replace(/^\/api/, '').split('?')[0]
  for (const [prefix, table] of Object.entries(ENDPOINT_TABLE_MAP)) {
    if (clean.startsWith(prefix)) return table
  }
  return null
}

function getCompanyId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.current_company || null
  } catch { return null }
}

const offlineApi = {
  async get(url, config = {}) {
    if (syncState.isOnline) {
      return api.get(url, config)
    }
    // Serve from IndexedDB
    const table = tableForUrl(url)
    if (table) {
      const companyId = getCompanyId()
      const rows = await getLocal(table, companyId)
      return { data: rows, status: 200, offline: true }
    }
    // Fallback: attempt network anyway
    return api.get(url, config)
  },

  async post(url, data = {}, config = {}) {
    if (syncState.isOnline) {
      return api.post(url, data, config)
    }
    const table = tableForUrl(url)
    const localId = Date.now()
    if (table) {
      const record = { ...data, id: null, localId, _synced: false, _dirty: true }
      await db[table]?.add(record).catch(() => {})
      await enqueueSync(table, 'create', data)
      return { data: record, status: 201, offline: true }
    }
    return api.post(url, data, config)
  },

  async put(url, data = {}, config = {}) {
    if (syncState.isOnline) {
      return api.put(url, data, config)
    }
    const table = tableForUrl(url)
    const idMatch = url.match(/\/(\d+)$/)
    const serverId = idMatch ? Number(idMatch[1]) : null
    if (table && serverId) {
      await db[table]?.where('id').equals(serverId).modify({ ...data, _dirty: true, _synced: false }).catch(() => {})
      await enqueueSync(table, 'update', data, serverId)
      return { data, status: 200, offline: true }
    }
    return api.put(url, data, config)
  },

  async delete(url, config = {}) {
    if (syncState.isOnline) {
      return api.delete(url, config)
    }
    const table = tableForUrl(url)
    const idMatch = url.match(/\/(\d+)$/)
    const serverId = idMatch ? Number(idMatch[1]) : null
    if (table && serverId) {
      await db[table]?.where('id').equals(serverId).delete().catch(() => {})
      await enqueueSync(table, 'delete', {}, serverId)
      return { data: { message: 'Queued for deletion' }, status: 200, offline: true }
    }
    return api.delete(url, config)
  },
}

export { offlineApi }
export default offlineApi
