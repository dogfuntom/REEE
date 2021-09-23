// Note that dependency is very very simple.
// We can insert its code right here directly with minor modifications.
// And thus decrement the count of dependencies.
import createMetaMaskProvider from 'https://esm.sh/metamask-extension-provider'

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
  async initialize() {
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
   * @param {string} nonce our nonce
   * @param {string} [chainId=1]
   */
  // Mostly a copy from here: https://docs.metamask.io/guide/signing-data.html (scroll to bottom then click JavaScript tab).
  async sign(nonce, chainId) {
    const from = this.account
    const provider = this.provider
    chainId = chainId ?? '1'

    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: chainId,
        // Give a user friendly name to the specific contract you are signing for.
        name: 'REEE',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: 'https://reee.uk',
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },

      // Defining the message signing data content.
      message: {
        // Not gonna include userIdent until we know we want it included.
        //reeeUserIdent: userIdent,
        reeeUserNonce: nonce,
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'ReeeAuth',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Refer to PrimaryType
        ReeeAuth: [
          //{ name: 'reeeUserIdent', type: 'string' },
          { name: 'reeeUserNonce', type: 'string' },
        ],
      },
    });

    var params = [from, msgParams];
    var method = 'eth_signTypedData_v4';
    const signature = await provider.request({method, params})
    return signature
  }
}
