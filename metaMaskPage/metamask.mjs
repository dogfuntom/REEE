// @ts-check

export default class MetaMaskFacade {
  constructor (provider) {
    this.provider = provider
  }

  /**
   * Requests MetaMask account.
   * According to guidelines should be used only on button press or similar user action.
   * But call-site doesn't have to use it at all.
   * Instead, this class calls it itself in each of other methods.
   * (Cleaner usage for the price of imperceivable impact on performance.)
   */
  async initializeAsync() {
    const eth = this.provider

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
   * @param {Object} chainInfo
   * @param {number} chainInfo.chainId
   * @param {string} chainInfo.chainName
   * @param {string} chainInfo.currencyName
   * @param {string} chainInfo.currencySymbol
   * @param {number} chainInfo.currencyDecimals
   * @param {string[]} chainInfo.rpcUrls
   * @param {string} chainInfo.blockExplorerUrl
   */
  async addChainAsync({
    chainId, chainName, currencyName, currencySymbol, currencyDecimals, rpcUrls, blockExplorerUrl
  }) {
    const toHex = (num) => {
      return '0x' + num.toString(16)
    }

    const ethereum = this.provider

    try {
      await this.initializeAsync()
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
            blockExplorerUrls: [blockExplorerUrl]
          }
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params, this.account],
          });
        } catch (addError) {
          // handle "add" error
          throw addError
        }
      } else {
        // handle other "switch" errors
        throw switchError
      }
    }
  }
}

/**
 * @typedef {Object} Provider
 * @property {(args: RequestArguments) => Promise<unknown>} request
 */
