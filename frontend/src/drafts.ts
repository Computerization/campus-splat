/**
 * Photo drafts: files a volunteer picked but has not uploaded yet.
 *
 * Kept in IndexedDB per checkpoint, because phones close browser tabs, reload
 * pages, and hop to the camera app and back — and picking a dozen photos again
 * while standing in a corridor is exactly what makes people give up. `File`
 * objects survive structured cloning, so a draft goes straight back into the
 * uploader.
 *
 * Every function swallows storage errors on purpose: a draft is a convenience,
 * and none of it may break an upload.
 */

const DB_NAME = 'campus-checkpoint-drafts'
const STORE = 'drafts'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function readDraft(checkpointId: number): Promise<File[]> {
  try {
    const db = await openDb()
    return await new Promise<File[]>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readonly')
      const request = transaction.objectStore(STORE).get(String(checkpointId))
      request.onsuccess = () => resolve((request.result as File[] | undefined) ?? [])
      request.onerror = () => reject(request.error)
      transaction.oncomplete = () => db.close()
    })
  } catch {
    return []
  }
}

export async function writeDraft(checkpointId: number, files: File[]): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readwrite')
      const store = transaction.objectStore(STORE)
      // An empty draft is a deletion: nothing left to come back to.
      if (files.length) store.put(files, String(checkpointId))
      else store.delete(String(checkpointId))
      transaction.oncomplete = () => { db.close(); resolve() }
      transaction.onerror = () => { db.close(); reject(transaction.error) }
      transaction.onabort = () => { db.close(); reject(transaction.error) }
    })
  } catch {
    /* ignore */
  }
}

export async function clearDraft(checkpointId: number): Promise<void> {
  await writeDraft(checkpointId, [])
}
