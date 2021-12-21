import Backend from './Backend.mjs'
import { MetaMaskFacade, binanceMainnetChainId as chainId } from './metamask.mjs'
import { getUserIdentAsync } from '../common/user.js'

// NOTE: don't forget to run build when changing this.
const backendUrl = 'https://reee-blockchain-k9uqc.ondigitalocean.app/'
// const backendUrl = 'http://localhost:3000'

{
  const kovanButton = document.getElementById('kovan')
  if (kovanButton instanceof HTMLButtonElement) {
    kovanButton.onclick = async () => {
      try {
        kovanButton.disabled = true
        await loginAsync(chainId, txt => kovanButton.innerText = txt)
      } finally {
        kovanButton.disabled = false
      }
    }
  }

  const binanceTestButton = document.getElementById('binanceTestSign')
  if (binanceTestButton instanceof HTMLButtonElement) {
    binanceTestButton.onclick = async () => {
      try {
        binanceTestButton.disabled = true
        await loginAsync(chainId, txt => binanceTestButton.innerText = txt)
      } finally {
        binanceTestButton.disabled = false
      }
    }
  }
}

/**
 *
 * @param {string} chainId
 * @param {function} renderText
 */
async function loginAsync (chainId, renderText) {
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
    await loginImplAsync(await getUserIdentAsync(), mmf, chainId)
    renderText('successful login')
  } catch (err) {
    renderError(err, renderText)
    throw err
  }
}

function renderError (msg, renderText) {
  if ((msg.message !== undefined) && (msg.code !== undefined)) {
    // MetaMask error.
    renderText (`${msg.code}: ${msg.message}`)
  } else {
    renderText (String(msg))
  }
}

const backend = new Backend(backendUrl)

/**
 * @param {string} userIdent
 * @param {MetaMaskFacade} mmf
 * @param {string} chainId
 * @returns {Promise<boolean>}
 */
async function loginImplAsync (userIdent, mmf, chainId) {
  const publicAddress = mmf.account

  const nonce = await backend.getOrCreateNonce(userIdent)
  const signature = await mmf.signAsync(userIdent, nonce, chainId)

  console.log(`Preparing to verify... (Data is: ${
    JSON.stringify({publicAddress, nonce, chainId, signature})
  }.)`)
  if (await backend.verify(userIdent, publicAddress, signature)) {
    return
  } else {
    throw 'verification failed for unknown reason'
  }
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
