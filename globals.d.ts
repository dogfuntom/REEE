declare namespace browser {
  declare namespace storage {
    interface StorageArea {
      get: any,
      set: any
    }

    const local: StorageArea,
    const sync: StorageArea,
  }

}

