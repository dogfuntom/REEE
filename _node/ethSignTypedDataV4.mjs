export default toMsgParams

/**
 * Prepares msgParams for eth_signTypedData_v4.
 * This function purpose is be exactly the same between frontend and backend.
 * @param {string} userIdent our user ID
 * @param {string} nonce our nonce
 * @param {string} [chainId=56] the default is Binance Main Network
 */
function toMsgParams(userIdent, nonce, chainId){
  chainId = chainId ?? '56'

  const msgParams = {
    domain: {
      // Defining the chain aka Rinkeby testnet or Ethereum Main Net
      chainId,
      // Give a user friendly name to the specific contract you are signing for.
      name: 'REEE',
      // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
      verifyingContract: 'https://reee.uk',
      // Just let's you know the latest version. Definitely make sure the field name is correct.
      version: '1'
    },

    // Defining the message signing data content.
    message: {
      reeeUserIdent: userIdent,
      reeeUserNonce: nonce
    },
    // Refers to the keys of the *types* object below.
    primaryType: 'ReeeAuth',
    types: {
      // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' }
      ],
      // Refer to PrimaryType
      ReeeAuth: [
        { name: 'reeeUserIdent', type: 'string' },
        { name: 'reeeUserNonce', type: 'string' }
      ]
    }
  }

  return msgParams
}
