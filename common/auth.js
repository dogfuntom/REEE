import getRandomAuthToken from './authTokens.js'
import FetchError, { WrapperFetchError } from './fetchError.js'

/**
 * @param {string | URL} host
 * @returns {Promise<string>}
 * @throws {FetchError}
 */
export default async function authAsync (host) {
  try {
    const url = new URL(`./auth/${String(getRandomAuthToken())}`, host)
    const response = await window.fetch(url.href, {
    })

    if (!response.ok) {
      throw new FetchError(`Server responded with error code: ${response.status}`)
    }

    const json = await response.json()
    if (!json.msg || json.msg !== 'success') {
      console.warn('"msg": "success" is expected in response. Trying to continue anyway...')
    }

    const token = json.token
    return token
  } catch (error) {
    if (error instanceof FetchError) { throw error } else { throw new WrapperFetchError(error) }
  }
}
