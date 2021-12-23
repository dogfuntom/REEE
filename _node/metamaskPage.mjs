import { MetaMaskFacade } from './metamask.mjs'
import { } from './metamaskLogin.mjs'
import PrototypeButton from './PrototypeButton.mjs'

{
  const binanceButton = new PrototypeButton(/** @type {HTMLButtonElement} */ (document.getElementById('binance')))
  binanceButton.onclick = async () => {
    const rpcUrls = [
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org",
      "https://bsc-dataseed1.defibit.io",
      "https://bsc-dataseed2.defibit.io",
      "https://bsc-dataseed3.defibit.io",
      "https://bsc-dataseed4.defibit.io",
      "https://bsc-dataseed1.ninicoin.io",
      "https://bsc-dataseed2.ninicoin.io",
      "https://bsc-dataseed3.ninicoin.io",
      "https://bsc-dataseed4.ninicoin.io",
      "wss://bsc-ws-node.nariox.org"
    ]
    await addNetworkAsync(56, 'Binance Smart Chain Mainnet', 'BNB', rpcUrls, 'https://bscscan.com')
    return 'done'
  }
}

{
  const binanceTestButton = new PrototypeButton(/** @type {HTMLButtonElement} */ (document.getElementById('binanceTest')))
  binanceTestButton.onclick = async () => {
    const rpcUrls = [
      "https://data-seed-prebsc-1-s1.binance.org:8545",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545"
    ]
    await addNetworkAsync(97, 'Binance Smart Chain Testnet', 'tBNB', rpcUrls, 'https://testnet.bscscan.com')
    return 'done'
  }
}

{
  const trackReeeButton = new PrototypeButton(/** @type {HTMLButtonElement} */ (document.getElementById('token')))
  trackReeeButton.onclick = async () => {
    await watchReeeAssetAsync()
  }
}

async function addNetworkAsync (chainId, chainName, currencySymbol, rpcUrls, blockExplorerUrl) {
  const mmf = new MetaMaskFacade(error => {
    if (error && error.includes('lost connection')) {
      throw 'MetaMask extension not detected.'
    }
    else {
      throw error
    }
  })

  await mmf.initializeAsync()
  await mmf.addChainAsync(chainId, chainName, 'Binance Chain Native Token', currencySymbol, 18, rpcUrls, blockExplorerUrl)
}

async function watchReeeAssetAsync () {
  const mmf = new MetaMaskFacade(error => {
    if (error && error.includes('lost connection')) {
      throw 'MetaMask extension not detected.'
    }
    else {
      throw error
    }
  })

  await mmf.initializeAsync()
  await mmf.watchAssetAsync('0x41664b1316fceac8578801bd6eb130ef0cfbec69', 'REEE', 18)
}

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 */
