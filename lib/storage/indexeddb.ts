'use client'

export class IndexedDBStore<T extends { id: string }> {
  private dbName: string
  private storeName: string
  private version: number
  private db: IDBDatabase | null = null

  constructor(dbName: string, storeName: string, version = 1) {
    this.dbName = dbName
    this.storeName = storeName
    this.version = version
  }

  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve(this.db)
      }

      request.onerror = () => reject(request.error)
    })
  }

  private async transaction(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest
  ): Promise<unknown> {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, mode)
      const store = tx.objectStore(this.storeName)
      const request = fn(store)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async add(item: T): Promise<T> {
    await this.transaction('readwrite', (store) => store.add(item))
    return item
  }

  async put(item: T): Promise<T> {
    await this.transaction('readwrite', (store) => store.put(item))
    return item
  }

  async get(id: string): Promise<T | undefined> {
    return this.transaction('readonly', (store) => store.get(id)) as Promise<T | undefined>
  }

  async getAll(): Promise<T[]> {
    return this.transaction('readonly', (store) => store.getAll()) as Promise<T[]>
  }

  async delete(id: string): Promise<void> {
    await this.transaction('readwrite', (store) => store.delete(id))
  }

  async clear(): Promise<void> {
    await this.transaction('readwrite', (store) => store.clear())
  }

  async count(): Promise<number> {
    return this.transaction('readonly', (store) => store.count()) as Promise<number>
  }
}
