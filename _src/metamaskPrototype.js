import BackendFake from './BackendFake.js'
import { MetaMaskFacade, kovanChainId } from './metamask.js'

// For now, just test here.
/** @type {HTMLButtonElement} */
const button = document.getElementById('test')
button.onclick = async () => {
  try {
    button.disabled = true
    await performMMLoginExperiment()
  } finally {
    button.disabled = false
  }
}

async function performMMLoginExperiment () {
  const mmf = new MetaMaskFacade(error => {
    if (error && error.includes('lost connection')) {
      renderText('MetaMask extension not detected.')
    }
    else {
      renderText(error)
    }
  })

  await mmf.initialize()
  await fakeLogin(mmf)
}

function renderText (text) {
  button.innerText = text
}

const backend = new BackendFake()

/**
 * @param {MetaMaskFacade} mmf
 * @returns {Promise<boolean>}
 */
async function fakeLogin (mmf) {
  const publicAddress = mmf.account
  const eth = mmf.provider

  const nonce = backend.getOrCreateNonce(publicAddress)
  console.info(eth)

  const signature = await mmf.sign(nonce, kovanChainId)
  console.log(signature)

  if (backend.verify(nonce, publicAddress, signature)) {
    renderText('successful login')
  } else {
    renderText('login failed')
  }
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
