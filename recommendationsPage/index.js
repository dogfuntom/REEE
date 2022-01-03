import { getUserIdentAsync, makeHistoryPostAsync } from '../common/user.js'
import RecommendationsView from './RecommendationsView.js'
import { StatusType, StatusView } from './StatusView.js'
import authAsync from '../common/auth.js'
import { WrapperFetchError } from '../common/fetchError.js'
import ensureConsentIsAskedAsync from '../privacyConsent/privacyConsent.js'

/**
 * @typedef {Object} GetResponseJson
 * @property {string[]} video_strIndents
 * @property {string | undefined} msg
 */

const baseUrl = 'https://api.reee.uk/'

/**
 * @param {string} token
 * @param {string | URL} base
 * @returns {Promise<Response>}
 * @throws {FetchError}
 */
async function fetchRecommendationsAsync (token, base) {
  try {
    profile(getUserIdentAsync.name)
    const userIdent = await getUserIdentAsync()
    const url = new URL(`./video_recommendation/users/${userIdent}/${token}`, base)
    profileEnd(getUserIdentAsync.name)

    profile(fetch.name)
    const response = await fetch(url.href)
    console.debug(response)
    profileEnd(fetch.name)

    return response
  } catch (err) {
    throw WrapperFetchError.toFetchError(err)
  }
}

/**
 * Fetches and shows either recommendations or an error.
 * @param {StatusView} statusView
 * @param {RecommendationsView} recommendationsView
 * @returns {Promise}
 */
async function fetchAndShowRecommendationsAsync (statusView, recommendationsView) {
  /**
   * @param {string[]} strIdents
   * @returns {string[]} */
  function filterValidStrIdents (strIdents) {
    const re = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/
    return strIdents.filter(strIdent => re.test(strIdent))
  }

  /** @param {Promise<GetResponseJson>} jsonPromise */
  async function showRecsOrStatusAsync (jsonPromise) {
    const json = await jsonPromise
    if (json.msg === 'the user is not registered in the system' || !json.video_strIndents || json.video_strIndents.length === 0) {
      statusView.showStatus(StatusType.NoUser)
    } else {
      const recs = filterValidStrIdents(json.video_strIndents)
      recommendationsView.changeRecommendations(recs)
      statusView.showStatus(StatusType.OK)
    }
  }

  profile(authAsync.name)
  const token = await authAsync(baseUrl)
  profileEnd(authAsync.name)

  profile(fetchRecommendationsAsync.name)
  const response = await fetchRecommendationsAsync(token, baseUrl)
  profileEnd(fetchRecommendationsAsync.name)

  /** @param {Response} response */
  if (response.ok) {
    profile(showRecsOrStatusAsync.name)
    return showRecsOrStatusAsync(response.json())
      .finally(() => profileEnd(showRecsOrStatusAsync.name))
  } else {
    let errorText = response.statusText
    if (!errorText || errorText.length === 0) {
      errorText = response.status.toString()
    }
    statusView.showOtherError(errorText)
  }
}

const statusView = new StatusView(
  window.document.getElementById('loading'),
  window.document.getElementById('noUser'),
  window.document.getElementById('emptyHistory'),
  window.document.getElementById('otherError'),
  window.document.getElementById('otherErrorContent')
)
const recommendationsView = new RecommendationsView(window.document.getElementById('container'))

const refreshButton = /** @type {HTMLButtonElement} */ (window.document.getElementById('refresh'))

// Get the recommendations asap.
fetchAndShowRecommendationsAsync(statusView, recommendationsView)
  .catch(e => statusView.showOtherError(e))
  .finally(() => { refreshButton.disabled = false })

/**
 * @param {MouseEvent | KeyboardEvent} _ev
 */
async function onclick (_ev) {
  refreshButton.disabled = true
  console.group('Refresh button has been clicked.')

  try {
    if (!await ensureConsentIsAskedAsync()) return

    const data = await makeHistoryPostAsync()
    console.log('Got history data:', data)

    if (data.userHistory.length === 0) {
      statusView.showStatus(StatusType.EmptyHistory)
      console.log('History is empty, showing empty history status.')
      return
    }

    const token = await authAsync(baseUrl)
    const urlWithoutToken = new URL('./video_recommendation/users/', baseUrl)
    const urlWithToken = new URL('./' + token, urlWithoutToken)
    const response = await fetch(urlWithToken.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) console.error(response)

    console.log('History data sent, getting fresh recommendations')
    await fetchAndShowRecommendationsAsync(statusView, recommendationsView)
  } finally {
    console.groupEnd()
    refreshButton.disabled = false
  }
}

refreshButton.onclick = onclick
refreshButton.onkeydown = onclick

/**
 * @param {string} label
 */
function profile (label) {
  const c = /** @type {Console | (Console & { profile: (label: string) => void })} */ (console)
  if ('profile' in c) c.profile(label)
}

/**
 * @param {string} label
 */
function profileEnd (label) {
  const c = /** @type {Console | (Console & { profileEnd: (label: string) => void })} */ (console)
  if ('profileEnd' in c) c.profileEnd(label)
}
