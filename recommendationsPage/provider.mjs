/**
 * @extends {Provider}
 */
export class MetaMaskProvider {
  /**
   * @param {browser.runtime.Port} port
   */
  constructor (port) {
    this.port = port
  }

  /**
   * @param {RequestArguments} args
   * @returns {Promise<unknown>}
   * @throws {ProviderRpcError}
   */
  async request (args) {
    const id = currentId++

    const req = makeJsonRpcRequestToMM(args.method, id, args.params)
    this.port.postMessage(req)

    const jrr = await getJsonRpcResponseFromMM(this.port, id)
    if ('error' in jrr) {
      throw jrr.error
    }

    return jrr.result
  }
}

// /**
//  * @implements {ProviderRpcError}
//  */
// export class RpcError extends Error {
//   /**
//    * @param {string} message
//    * @param {number} code
//    * @param {unknown} [data]
//    */
//   constructor (message, code, data) {
//     super(message)
//     this.code = code
//     this.data = data
//   }
// }

// Ids.

let currentId = 0;

// Requests.

/**
 * @param {JsonRpcNotification | JsonRpcRequest} jsonRpcRequest
 */
function makeMetaMaskRequest (jsonRpcRequest) {
  return {
    data: jsonRpcRequest,
    name: 'metamask-provider'
  }
}

/**
 * @param {string} method
 * @param {number | null} id
 * @param {object | Array} [params]
 * @returns {{ data: JsonRpcRequest, name: string }}
 */
function makeJsonRpcRequestToMM (method, id, params) {
  if (!params) params = []

  const jsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id
  }

  return { data: jsonRpcRequest, name: 'metamask-provider' }
}

/**
 * @param {string} method
 * @param {number | null} id
 * @param {object | Array} [params]
 * @returns {JsonRpcRequest}
 */
function makeJsonRpcRequest (method, id, params) {
  if (!params) params = []

  return {
    jsonrpc: '2.0',
    method,
    params,
    id
  }
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
    onMessage = (/** @type {string} */ response) => {
      if (typeof response === 'string') response = JSON.parse(response)
      if (predicate(response)) resolve(response)
      // Otherwise, do nothing, continue waiting for it.
    }

    onDisco = (/** @type {any} */ _p) => { reject (new Error('Unexpectedly disconnected.')) }
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
