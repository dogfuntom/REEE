import connectToAnyAsync from "./connect.mjs"
import MetaMaskFacade from "./metamask.mjs"
import { MetaMaskProvider } from "./provider.mjs"

const binanceMainnetChainId = 56
const chainId = binanceMainnetChainId

const ids = {
  "CHROME_ID": "nkbihfbeogaeaoehlefnkodbefgpgknn",
  "FIREFOX_ID": "webextension@metamask.io"
}

const providerPromise = createProvider()

const button = document.getElementById('binance')
if (button instanceof HTMLButtonElement) {
  button.onclick = async () => {
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
    await addNetworkAsync(await providerPromise, { chainId, chainName: 'Binance Smart Chain Mainnet', currencySymbol: 'BNB', rpcUrls, blockExplorerUrl: 'https://bscscan.com' })
  }
}

async function createProvider () {
  const port = await connectToAnyAsync([ids.CHROME_ID, ids.FIREFOX_ID])
  const provider = new MetaMaskProvider(port)
  return provider
}

/**
 * @param {Provider} provider
 * @param {Object} chainInfo
 * @param {number} chainInfo.chainId
 * @param {string} chainInfo.chainName
 * @param {string} chainInfo.currencySymbol
 * @param {string[]} chainInfo.rpcUrls
 * @param {string} chainInfo.blockExplorerUrl
 */
async function addNetworkAsync (
  provider, {
    chainId, chainName, currencySymbol, rpcUrls, blockExplorerUrl
  }) {
  const mmf = new MetaMaskFacade(provider)
  await mmf.addChainAsync({ chainId, chainName, currencyName: 'Binance Chain Native Token', currencySymbol, currencyDecimals: 18, rpcUrls, blockExplorerUrl })
}

/**
 * @typedef {Object} Provider
 * @property {(args: RequestArguments) => Promise<unknown>} request
 */
