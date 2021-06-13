import { getUserIdentAsync, makeHistoryPostAsync } from '../common/user.mjs'
import RecommendationsView from './RecommendationsView.mjs'
import { StatusType, StatusView } from './StatusView.mjs'

/**
 * @typedef {Object} GetResponseJson
 * @property {string[]} video_strIndents
 */

/** @returns {Promise<Response | null>} */
async function fetchRecommendationsAsync () {
  const userIdent = await getUserIdentAsync()
  const url = 'http://161.35.7.92/video_recommendation/users/' + userIdent

  /** @type {Response} */
  const response = await window.fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response ?? null
}

/**
 * Fetches and shows either recommendations or an error.
 * @param {StatusView} statusView
 * @param {RecommendationsView} recommendationsView
 * @returns {Promise}
 */
function fetchAndShowRecommendationsAsync (statusView, recommendationsView) {
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

  return fetchRecommendationsAsync()
    .then(
      /** @param {Response} response */
      response => {
        if (response.ok) {
          return showRecsOrStatusAsync(response.json())
        } else {
          let errorText = response.statusText
          if (!errorText || errorText.length === 0) {
            errorText = response.status
          }
          statusView.showOtherError(errorText)
        }
      })
    .catch(error => {
      statusView.showOtherError(error)
    })
}

const statusView = new StatusView(
  window.document.getElementById('loading'),
  window.document.getElementById('noUser'),
  window.document.getElementById('emptyHistory'),
  window.document.getElementById('otherError'),
  window.document.getElementById('otherErrorContent')
)
const recommendationsView = new RecommendationsView(window.document.getElementById('container'))

const refreshButton = window.document.getElementById('refresh')

// Get the recommendations asap.
fetchAndShowRecommendationsAsync(statusView, recommendationsView)
  .finally(() => { refreshButton.disabled = false })

// Upload history and get recommendations on button press.
refreshButton.onclick = async () => {
  refreshButton.disabled = true
  console.group('Refresh button has been clicked.')

  try {
    const data = await makeHistoryPostAsync()
    console.log('Got history data:', data)

    if (data.userHistory.length === 0) {
      statusView.showStatus(StatusType.EmptyHistory)
      console.log('History is empty, showing empty history status.')
      return
    }

    /** @type {Response} */
    const response = await window.fetch('http://161.35.7.92/video_recommendation/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch(console.error)

    if (response) {
      if (!response.ok) console.error(response)
    } else {
      console.error('no response')
    }

    console.log('History data sent, getting fresh recommendations')
    fetchAndShowRecommendationsAsync(statusView, recommendationsView)
    // .finally(() => { refreshButton.disabled = false })
  } finally {
    console.groupEnd()
    refreshButton.disabled = false
  }
}

refreshButton.onkeypress = refreshButton.onclick
