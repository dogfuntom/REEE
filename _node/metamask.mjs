// Note that dependency is very very simple.
// We can insert its code right here directly with minor modifications.
// And thus decrement the count of dependencies.

// import createMetaMaskProvider from 'https://esm.sh/metamask-extension-provider'
// import createMetaMaskProvider from 'https://cdn.skypack.dev/metamask-extension-provider';
// todo: this dependency is rotten (it depends on deprecated versions of its dependencies), just use it as an inspiration/know-how instead of a direct dependency
import createMetaMaskProvider from 'metamask-extension-provider'

import toMsgParams from './ethSignTypedDataV4.mjs'

/**
 * @typedef {Object} MetaMaskProvider
 * @property {function} on
 * @property {function} request
 */

/**
 * @callback ErrorHandler
 * @param {*} error
 */

export const kovanChainId = '42'
export const binanceMainnetChainId = '56'
export const binanceTestnetChainId = '97'

/**
 * Wrapper for MetaMask-related or ethereum-related APIs
 * that makes using them handier for REEE's needs specifically.
 */
export class MetaMaskFacade {
  /**
   * Immediately fetches a provider.
   * (Not sure if it limits how early it can be used or if it may produce error.)
   * @param {ErrorHandler} [errorHandler]
   */
  constructor (errorHandler) {
    this.provider = createMetaMaskProvider()

    if (!this.provider) {
      console.error('MetaMask provider not detected.')
      return
    }

    if (errorHandler) this.provider.on('error', errorHandler)
  }

  /**
   * Requests MetaMask account.
   * According to guidelines should be used only on button press or similar user action.
   */
  async initializeAsync() {
    const provider = this.provider

    console.log('provider detected', provider)

    const eth = provider

    if (!eth.isMetaMask) {
      console.log('Non-MetaMask wallet. Only MetaMask is supported currently.')
      return
    }

    console.log('MetaMask provider detected.')

    const accounts = await eth.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]

    if (account) {
      console.log(`Detected MetaMask account ${account}`)
    } else {
      throw `There's no MetaMask account or there's no access to it`
    }

    this.account = account
  }

  /**
   * Signs a message. Atm of writing this doc it uses eth_signTypedData_v4 (not fully decided yet).
   * @param {string} userIdent our user ID
   * @param {string} nonce our nonce
   * @param {string} [chainId=56]
   */
  async signAsync(userIdent, nonce, chainId) {
    const from = this.account
    const provider = this.provider
    chainId = chainId ?? '56'

    const msgParams = JSON.stringify(toMsgParams(userIdent, nonce, chainId))

    const params = [from, msgParams];
    const method = 'eth_signTypedData_v4';
    const signature = await provider.request({method, params})
    return signature
  }

  async addChainAsync (chainId, chainName, currencyName, currencySymbol, currencyDecimals, rpcUrls, blockExplorerUrl) {
    const toHex = (num) => {
      return '0x'+num.toString(16)
    }
    const ethereum = this.provider

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHex(chainId) }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const params = {
            chainId: toHex(chainId),
            chainName: chainName,
            nativeCurrency: {
              name: currencyName,
              symbol: currencySymbol, // 2-6 characters long
              decimals: currencyDecimals,
            },
            rpcUrls: rpcUrls,
            blockExplorerUrls: [ blockExplorerUrl ]
          }
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params, this.account],
          });
        } catch (addError) {
          // handle "add" error
          throw addError
        }
      }
      // handle other "switch" errors
      throw switchError
    }
  }

  async watchAssetAsync (address, symbol, decimals) {
    const success = await this.provider .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          // image,
        },
      },
    })

    if (!success) {
      throw new Error('Something went wrong.')
    }
  }
}
