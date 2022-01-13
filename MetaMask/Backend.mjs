/**
 * A facade that wraps the REST API of our blockchain-related backend.
 * @module
 */

/**
 * A facade that wraps the REST API of our blockchain-related backend.
 */
export default class Backend {
  /**
   * @param {string | URL} host
   */
  constructor (host) {
    this.usersUrl = new URL('users', host)
  }

  async getOrCreateNonce (userIdent) {
    const url = new URL(`${this.usersUrl.pathname}/${userIdent}`, this.usersUrl)
    const response = await fetch(url.href)

    if (!response.ok) {
      throw new Error(`Server responded with error code: ${response.status}`)
    }

    return response.text()
  }

  async verify (userIdent, publicAddress, signature) {
    const response = await fetch(
      new URL(`${this.usersUrl.pathname}/${userIdent}/${publicAddress}/${signature}`, this.usersUrl).href,
      { method: 'put' })

    if (!response.ok) {
      throw new Error(`Server responded with error code: ${response.status}`)
    }

    const text = await response.text()

    return text === 'true'
  }
}
