import Backend from './Backend.mjs'
import { MetaMaskFacade, binanceMainnetChainId as chainId } from './metamask.mjs'
import { getUserIdentAsync } from '../common/user.js'

// @remind Backend URL. Don't forget to run build when changing this.
// const backendUrl = 'https://reee-blockchain-k9uqc.ondigitalocean.app/'
const backendUrl = 'http://localhost:3000'

{
  const binanceTestButton = document.getElementById('binanceSign')
  if (binanceTestButton instanceof HTMLButtonElement) {
    binanceTestButton.onclick = async () => {
      try {
        binanceTestButton.disabled = true
        await loginAsync(chainId, text => binanceTestButton.innerText = text)
      } finally {
        binanceTestButton.disabled = false
      }
    }
  }
}

/**
 *
 * @param {string} chainId
 * @param {(text: string) => void} renderText
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
    await loginImplAsync(await getUserIdentAsync(), mmf, chainId, renderText)
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
    renderText (msg.toString())
  }
}

const backend = new Backend(backendUrl)

/**
 * @param {string} userIdent
 * @param {MetaMaskFacade} mmf
 * @param {string} chainId
 * @param {(text: string) => void} [ongoingStatusCallback]
 * @returns {Promise<boolean>}
 */
async function loginImplAsync (userIdent, mmf, chainId, ongoingStatusCallback) {
  if (!ongoingStatusCallback) ongoingStatusCallback = () => {}

  const publicAddress = mmf.account

  const nonce = await backend.getOrCreateNonce(userIdent)
  ongoingStatusCallback(nonce)

  const signature = await mmf.signAsync(userIdent, nonce, chainId)

  if (await backend.verify(userIdent, publicAddress, signature)) {
    return
  } else {
    console.info('Verification failed, the data is: ', {
      userIdent,
      chainId,
      publicAddress,
      nonce,
      signature
    })
    throw new Error('Verification failed for unknown reason.')
  }
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
