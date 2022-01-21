import connectToAnyAsync from "./connect.mjs"
import MetaMaskFacade from "./metamask.mjs"
import { MetaMaskProvider } from "./provider.mjs"
import { binanceMainnetChainId as chainId, metaMaskIds as ids, binanceMainnetRpcUrls as rpcUrls } from "./constants.mjs"

const providerPromise = createProvider()

const button = document.getElementById('binance')
if (button instanceof HTMLButtonElement) {
  button.onclick = async () => {
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
