import BackendFake from './BackendFake.js'
import { MetaMaskFacade, kovanChainId } from './metamask.js'

/** @type {HTMLButtonElement} */
const kovanButton = document.getElementById('kovan')
if (kovanButton instanceof HTMLButtonElement) {
  kovanButton.onclick = async () => {
    try {
      kovanButton.disabled = true
      await login(kovanChainId)
    } finally {
      kovanButton.disabled = false
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
    await mmf.initializeAsync()
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
  kovanButton.innerText = text
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

  const signature = await mmf.signAsync(nonce, chainId)
  console.log(signature)

  if (backend.verify(nonce, publicAddress, signature)) {
    return
  } else {
    throw 'verification failed'
  }
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
