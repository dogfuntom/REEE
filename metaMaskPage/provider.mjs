// @ts-check

/**
 * @extends {Provider}
 */
export class MetaMaskProvider {
  /**
   * @param {browser.runtime.Port} port
   */
  constructor (port) {
    this.port = port
    this.disco = null

    this.port.onDisconnect.addListener(p => this.disco = ('error' in p ? p.error.message : chrome.runtime.lastError))
  }

  /**
   * @param {RequestArguments} args
   * @returns {Promise<unknown>}
   * @throws {ProviderRpcError}
   */
  async request (args) {
    if (this.disco) throw new ProviderRpcErrorImpl("Cannot send request through the port because it's disconnected.", 1006, this.disco)

    try {
      const id = currentId++

      const req = makeJsonRpcRequestToMM(args.method, id, args.params)
      this.port.postMessage(req)

      const jrr = await getJsonRpcResponseFromMM(this.port, id)
      if ('error' in jrr) {
        throw jrr.error
      }

      return jrr.result
    } catch (err) {
      if (ProviderRpcErrorImpl.isCompatible(err)) throw err
      throw new ProviderRpcErrorImpl('Internal error.', 1011, err)
    }
  }
}

// Ids.

let currentId = 0;

// Requests.

/**
 * @param {string} method
 * @param {number | null} id
 * @param {object | Array} [params]
 * @returns {{ data: JsonRpcRequest, name: string }}
 */
function makeJsonRpcRequestToMM (method, id, params) {
  if (!params) params = []

  // A request object according to official JSON-RPC docs.
  const jsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id
  }

  // Wrapper for sending through webextension Port,
  // according to MetaMask's own implementation of extension provider (or rather, of base provider, that any provider inherits from).
  // (Note that on GitHub it's hard to find where exactly MetaMask defines this format because the whole app is thinly spread across many small repos.
  // To find where this format comes from, download the project and search in node_modules, or find a dApp website and use a debugger on it.)
  return { data: jsonRpcRequest, name: 'metamask-provider' }
}

// Responses.

/**
 * @param {browser.runtime.Port} port
 * @param {number} id
 * @returns {Promise<JsonRpcErrorResponse | JsonRpcSuccessResponse>}
 */
async function getJsonRpcResponseFromMM (port, id) {
  const mmm = await getFirstMessageFromThat(port, mmm => mmm.data.id === id)
  return mmm.data
}

/**
 * Awaits first message that fits the provided check.
 * @param {browser.runtime.Port} port
 * @param {(json: object) => boolean} predicate
 * @returns {Promise<object>} The received message as is (raw).
 */
async function getFirstMessageFromThat (port, predicate) {
  let onMessage, onDisco

  const promise = new Promise((resolve, reject) => {
    onMessage = (/** @type {string | object} */ response) => {
      if (typeof response === 'string') response = JSON.parse(response)
      if (predicate(response)) resolve(response)
      // Otherwise, do nothing, continue waiting for it.
    }

    onDisco = (/** @type {browser.runtime.Port & { error: Object? }} */ p) => {
      if ('error' in p) {
        reject(new ProviderRpcErrorImpl(p.error.message, 1006))
      } else {
        reject(new ProviderRpcErrorImpl(chrome.runtime.lastError, 1006))
      }
    }
  })

  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(onDisco)

  promise.finally(() => {
    port.onMessage.removeListener(onMessage)
    port.onDisconnect.removeListener(onDisco)
  })

  return promise
}

/**
 * @implements {ProviderRpcError}
 */
class ProviderRpcErrorImpl extends Error {
  /**
   * @param {string} message
   * @param {number} code
   * @param {unknown} [data]
   */
  constructor (message, code, data) {
    super (message)
    this.code = code
    this.data = data
  }

  /**
   * @override
   */
  toString () {
    return (
`${super.toString()}
Code: ${this.code}
Additional data: ${(this.data ? JSON.stringify(this.data) : 'no additional data')}`)
  }

  static isCompatible (error) {
    if ('message' in error && 'code' in error) {
      if (typeof error.message === 'string' && typeof error.code === 'number') return true
    }
    return false
  }
}

/**
 * @typedef {Object} Provider
 * @property {(args: RequestArguments) => Promise<unknown>} request
 */

/**
 * @typedef {Object} JsonRpcNotification
 * @property {string} jsonrpc
 * @property {string} method
 * @property {object | Array} [params]
 */

/**
 * @typedef {JsonRpcNotification & { id: string | number }} JsonRpcRequest
 */

/**
 * @typedef {Object} JsonRpcSuccessResponse
 * @property {string} jsonrpc
 * @property {unknown} result
 * @property {string | number} id
 */

/**
 * @typedef {Object} JsonRpcErrorResponse
 * @property {string} jsonrpc
 * @property {JsonRpcError} error
 * @property {string | number | null} id
 */

/**
 * @typedef {Object} JsonRpcError
 * @property {number} code
 * @property {string} message
 * @property {unknown} [data]
 */
