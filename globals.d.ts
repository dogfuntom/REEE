declare namespace browser {
  declare namespace storage {
    interface StorageArea {
      get: Promise,
      set: Promise
    }

    const local: StorageArea,
    const sync: StorageArea,
  }

  declare namespace runtime {
    interface Port {
      disconnect(): void
      postMessage(value: object): void

      onDisconnect: Event<Port>
      onMessage: Event<object | string>
    }

    interface Event<T> {
      addListener(handler: (arg: T) => void)
      removeListener(handler: (arg: T) => void)
    }

    function connect(extensionId?: string, connectInfo?: object): Port
  }
}

interface RequestArguments {
  readonly method: string;
  readonly params?: readonly unknown[] | object;
}

interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}
