// @ts-check
import { MetaMaskProvider } from "./provider.mjs"

const ids = {
  "CHROME_ID": "nkbihfbeogaeaoehlefnkodbefgpgknn",
  "FIREFOX_ID": "webextension@metamask.io"
}

const experimentFF = /** @type {HTMLButtonElement} */ (document.getElementById('experimentFF'))
experimentFF.onclick = () => onclickAsync(ids.FIREFOX_ID)

const experimentC = /** @type {HTMLButtonElement} */ (document.getElementById('experimentC'))
experimentC.onclick = () => onclickAsync(ids.CHROME_ID)

/**
 * @param {string} id
 */
async function onclickAsync (id) {
  const port = browser.runtime.connect(id)

  // @todo Do we even have to call this?
  // const mGpsRequest = makeJsonRpcRequest('metamask_getProviderState', 1)
  // port.postMessage(mGpsRequest)

  port.onDisconnect.addListener(p => console.debug('port disconnected', p))
  port.onMessage.addListener(m => console.debug('port received a message', m))

  try {
    // /** @type {{ accounts: string[], chainId: string, isUnlocked: boolean, networkVersion: string }} */
    // const publicConfig = (await getFirstMessageWithoutIdFrom(port)).data
    // console.debug(publicConfig)


    // const request = makeJsonRpcRequest('eth_requestAccounts', 2)
    // console.debug(JSON.stringify(request))
    // port.postMessage(makeMetaMaskRequest(request))

    // const response = await getJsonRpcResponse(port, 2)
    // console.info(response)
    // alert(`Your public address is ${response.result[0]}.`)

    const provider = new MetaMaskProvider(port)
    const response = await provider.request({ method: 'eth_requestAccounts' })

    if (Array.isArray(response)) {
      alert(`Your public address is ${response[0]}.`)
    } else {
      throw response
    }
  } catch (err) {
    console.error(err)
  }
}

// /**
//  * @param {browser.runtime.Port} port
//  * @param {number} id
//  */
// async function getResponse (port, id) {
//   let onMessage, onDisco

//   const promise = new Promise((resolve, reject) => {
//     onMessage = response => {
//       if (typeof response === 'string') response = JSON.parse(response)

//       if (String(response.id) !== String(id)) {
//         // reject(new Error('Unexpected ID. Note that parallel communication is not implemented yet.'))
//         reject(response)
//       }

//       resolve(response)
//     }

//     onDisco = p => {
//       reject (new Error('Unexpectedly disconnected.'))
//     }
//   })

//   port.onMessage.addListener(onMessage)
//   port.onDisconnect.addListener(onDisco)

//   promise.finally(() => {
//     port.onMessage.removeListener(onMessage)
//     port.onDisconnect.removeListener(onDisco)
//   })

//   return promise
// }

/**
 * Awaits first message from port that is not JSON-RPC response.
 * In other words, it can be JSON-RPC notification (a call without id),
 * or it may not be a JSON-RPC call at all.
 * @param {browser.runtime.Port} port
 * @returns {Promise<object>} The received message as is (raw).
 */
async function getFirstMessageWithoutIdFrom (port) {
  // let onMessage, onDisco

  // const promise = new Promise((resolve, reject) => {
  //   onMessage = response => {
  //     if (typeof response === 'string') response = JSON.parse(response)

  //     if (!response.id) resolve(response)

  //     // Otherwise, do nothing, continue waiting for it.
  //   }

  //   onDisco = _p => {
  //     reject (new Error('Unexpectedly disconnected.'))
  //   }
  // })

  // port.onMessage.addListener(onMessage)
  // port.onDisconnect.addListener(onDisco)

  // promise.finally(() => {
  //   port.onMessage.removeListener(onMessage)
  //   port.onDisconnect.removeListener(onDisco)
  // })

  // return promise
  return getFirstMessageFromThat(port, response => !response.id)
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
    onMessage = response => {
      if (typeof response === 'string') response = JSON.parse(response)
      if (predicate(response)) resolve(response)
      // Otherwise, do nothing, continue waiting for it.
    }

    onDisco = _p => { reject (new Error('Unexpectedly disconnected.')) }
  })

  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(onDisco)

  promise.finally(() => {
    port.onMessage.removeListener(onMessage)
    port.onDisconnect.removeListener(onDisco)
  })

  return promise
}

async function getJsonRpcResponse (port, id) {
  const mmm = await getFirstMessageFromThat(port, mmm => mmm.data.id === id)
  return mmm.data
}

/**
 * @param {string} method
 * @param {number | null} id
 * @param {object | Array} [params]
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

function makeMetaMaskRequest (jsonRpcRequest) {
  return {
    data: jsonRpcRequest,
    name: 'metamask-provider'
  }
}
