// @ts-check
import connectToAnyAsync from "./connect.mjs"
import MetaMaskFacade from "./metamask.mjs"
import { MetaMaskProvider } from "./provider.mjs"
import { binanceMainnetChainId as chainId, metaMaskIds as ids, binanceMainnetRpcUrls as rpcUrls } from "./constants.mjs"
import { getDidSignInAsync, signInAsync } from "./signIn.mjs"

const buttonIds = {
  addBinance: 'binance',
  watchReee: 'token',
  signIn: 'binanceSign'
}

const providerPromise = createProvider()

{
  const button = /** @type {HTMLButtonElement} */ (document.getElementById(buttonIds.addBinance))
  button.onclick = async () => {
    button.disabled = true
    try {
      await addNetworkAsync(await providerPromise, { chainId, chainName: 'Binance Smart Chain Mainnet', currencySymbol: 'BNB', rpcUrls, blockExplorerUrl: 'https://bscscan.com' })
      button.textContent = 'done';
    } catch (err) {
      console.error(err)
      setTextUsingBRs(button, err.toString())
      button.disabled = false
    }
  }
}

{
  const button = /** @type {HTMLButtonElement} */ (document.getElementById(buttonIds.watchReee))
  button.onclick = async () => {
    button.disabled = true
    try {
      await watchReeeAssetAsync(await providerPromise)
      button.textContent = 'done';
    } catch (err) {
      console.error(err)
      setTextUsingBRs(button, err.toString())
      button.disabled = false
    }
  }
}

{
  const button = /** @type {HTMLButtonElement} */ (document.getElementById(buttonIds.signIn))
  button.onclick = async () => {
    button.disabled = true
    try {
      await signInAsync(await providerPromise, chainId, m => button.textContent = m)
      button.textContent = 'done';
    } catch (err) {
      console.error(err)
      setTextUsingBRs(button, err.toString())
      button.disabled = false
    }
  }

  button.disabled = true
  Promise
    .race([
      new Promise((_, reject) => { setTimeout(reject, 1000, new Error('timeout')) }),
      getDidSignInAsync()
        .then(flag => {
          if (flag) button.textContent = 'Re-' + button.textContent
        })
        .catch(console.error)
    ])
    .finally(() => button.disabled = false)
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

async function watchReeeAssetAsync (provider) {
  const mmf = new MetaMaskFacade(provider)
  await mmf.watchAssetAsync('0x41664b1316fceac8578801bd6eb130ef0cfbec69', 'REEE', 18)
}

/**
 *
 * @param {HTMLElement} htmlElement
 * @param {string} text
 */
function setTextUsingBRs (htmlElement, text) {
  for (const child of htmlElement.childNodes) {
    child.remove()
  }

  const lines = text.replace('\r', '').split('\n')
  htmlElement.appendChild(document.createTextNode(lines[0]))
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index];
    htmlElement.appendChild(document.createElement('br'))
    htmlElement.appendChild(document.createTextNode(line))
  }
}

/**
 * @typedef {import("./provider.mjs").Provider} Provider
 */
