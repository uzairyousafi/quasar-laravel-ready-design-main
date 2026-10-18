/**
 * Local IndexedDB database via Dexie.js
 * Only platform tables exist in this scaffold (branches). Phase 2 modules
 * (Projects, Finance, Procurement, HR) will add their own cached tables here.
 */
import Dexie from 'dexie'

export const db = new Dexie('AriaHeratERP')

db.version(1).stores({
  branches: '++localId, id, company_id, name, _synced, _dirty',

  // Sync queue — operations pending server sync
  syncQueue: '++id, table, operation, recordId, createdAt, attempts',

  // Metadata — last sync timestamps per table
  syncMeta: 'table',
})

/**
 * Seed local tables from a server response array.
 * Uses bulkPut so existing records are overwritten.
 */
export async function seedTable(tableName, rows) {
  const tbl = db[tableName]
  if (!tbl || !Array.isArray(rows)) return
  const stamped = rows.map(r => ({ ...r, _synced: true, _dirty: false }))
  await tbl.bulkPut(stamped)
  await db.syncMeta.put({ table: tableName, lastSync: Date.now() })
}

/**
 * Get all records for a company from local DB.
 */
export async function getLocal(tableName, companyId) {
  const tbl = db[tableName]
  if (!tbl) return []
  if (companyId) return tbl.where('company_id').equals(companyId).toArray()
  return tbl.toArray()
}

/**
 * Enqueue a mutation (create/update/delete) when offline.
 * Will be replayed by the sync service when online.
 */
export async function enqueueSync(table, operation, payload, recordId = null) {
  await db.syncQueue.add({
    table,
    operation,
    payload,
    recordId,
    createdAt: Date.now(),
    attempts: 0,
  })
}

/**
 * Get pending sync queue entries ordered by creation time.
 */
export async function getPendingQueue() {
  return db.syncQueue.orderBy('createdAt').toArray()
}

/**
 * Remove a successfully synced queue entry.
 */
export async function dequeueSync(id) {
  await db.syncQueue.delete(id)
}

/**
 * Count pending unsynced mutations.
 */
export async function pendingCount() {
  return db.syncQueue.count()
}

export default db
