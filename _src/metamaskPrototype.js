import BackendFake from './BackendFake.js'
import { MetaMaskFacade, kovanChainId } from './metamask.js'

// For now, just test here.
/** @type {HTMLButtonElement} */
const button = document.getElementById('kovan')
if (button instanceof HTMLButtonElement) {
  button.onclick = async () => {
    try {
      button.disabled = true
      await login(kovanChainId)
    } finally {
      button.disabled = false
    }
  }
}

async function login (chainId) {
  const mmf = new MetaMaskFacade(error => {
    if (error && error.includes('lost connection')) {
      renderText('MetaMask extension not detected.')
    }
    else {
      renderText(error)
    }
  })

  try {
    await mmf.initialize()
    await fakeLogin(mmf, chainId)
    renderText('successful login')
  } catch (err) {
    renderError(err)
    throw err
  }
}

function renderError (msg) {
  if ((msg.message !== undefined) && (msg.code !== undefined)) {
    // MetaMask error.
    renderText (`${msg.code}: ${msg.message}`)
  } else {
    renderText (String(msg))
  }
}

function renderText (text) {
  button.innerText = text
}

const backend = new BackendFake()

/**
 * @param {MetaMaskFacade} mmf
 * @param {number} chainId
 * @returns {Promise<boolean>}
 */
async function fakeLogin (mmf, chainId) {
  const publicAddress = mmf.account
  const eth = mmf.provider

  const nonce = backend.getOrCreateNonce(publicAddress)
  console.info(eth)

  const signature = await mmf.sign(nonce, chainId)
  console.log(signature)

  if (backend.verify(nonce, publicAddress, signature)) {
    // renderText('successful login')
    return
  } else {
    // renderText('login failed')
    throw 'verification failed'
  }
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
