/**
 * A sketch of the role of the backend when dealing with MetaMask.
 * MetaMask user has public address but REEE already has userIdent.
 * So we need to link them and somehow deal with mismatches.
 * For simplicity this sketch pretends that REEE doesn't have userIdent and relies only on MetaMask public address.
 * (In reality, we have userIdent already and thus should somehow link (associate?) MM address with it.
 * Probably. Or maybe we should do something else to deal with this situation, who knows.)
 */
export default class BackendFake {
  constructor () {
    /** @type {Map<string, User>} */
    this.users = new Map()
  }

  getOrCreateNonce (publicAddress) {
    if (this.users.has(publicAddress)) {
      return this.users.get(publicAddress).nonce
    } else {
      const user = new User(publicAddress)
      const nonce = user.nonce
      this.users.set(publicAddress, user)
      return nonce
    }
  }

  verify (nonce, publicAddress, signature) {
    if (!this.users.get(publicAddress))
      return null

    const user = this.users.get(publicAddress)
    console.log(`Verification is skipped because this is a prototype. The data is: ${JSON.stringify({ nonce, publicAddress, signature, user })}`)

    user.reinit()
    return user.sessionID
  }
}

class User {
  constructor (publicAddress) {
    this.publicAddress = publicAddress
    this.reinit()
  }

  reinit() {
    this.nonce = String(getRandomToken())
    this.sessionID = String(getRandomToken())
  }
}

// From here: https://stackoverflow.com/a/23854032/776442
/** @returns {string} */
function getRandomToken () {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32)
  window.crypto.getRandomValues(randomPool)
  let hex = ''
  for (let i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16)
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex
}
