declare namespace browser {
  declare namespace storage {
    interface StorageArea {
      get: Promise,
      set: Promise
    }

    const local: StorageArea,
    const sync: StorageArea,
  }

}

