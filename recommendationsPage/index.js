import { getUserIdentAsync, makeHistoryPostAsync } from '../common/user.mjs'
import RecommendationsView from './RecommendationsView.mjs'
import { StatusType, StatusView } from './StatusView.mjs'

/** @returns {Promise<Response> | Promise<null>} */
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

  // 'the user is not registered in the system'
  // 'video_list'
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
const recommendationsView = new RecommendationsView(window.document.getElementById('section'))

const refreshButton = window.document.getElementById('refresh')

// Get the recommendations asap.
fetchAndShowRecommendationsAsync(statusView, recommendationsView)
  .finally(() => { refreshButton.disabled = false })

// Upload history and get recommendations on button press.
refreshButton.onclick = async () => {
  refreshButton.disabled = true

  const data = await makeHistoryPostAsync()

  if (data.userHistory.length === 0) {
    statusView.showStatus(StatusType.EmptyHistory)
    refreshButton.disabled = false
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

  fetchAndShowRecommendationsAsync(statusView, recommendationsView)
    .finally(() => { refreshButton.disabled = false })
}

refreshButton.onkeypress = refreshButton.onclick

// // NOTE: Firefox (maybe Chrome too) extensions are not allowed to download and execute code.
// // ("extensions with 'unsafe-eval', 'unsafe-inline', remote script, blob, or remote sources in their CSP are not allowed for extensions listed on addons.mozilla.org due to major security issues.")
// // Thus, we can't use the main official way to inline YT videos.
// // But there's an additional official way, so let's try it instead.

// /** @type {string[]} */
// const strIdents = filterValidStrIdents(recs.video_strIndents)
// strIdents.forEach(strIdent => {
//   /** @type {HTMLIFrameElement} */
//   const iframeForYT = window.document.createElement('iframe')
//   iframeForYT.id = 'player'
//   iframeForYT.type = 'text/html'
//   iframeForYT.width = 640
//   iframeForYT.height = 390
//   iframeForYT.src = `http://www.youtube.com/embed/${strIdent}?color=white&rel=0`

//   section.appendChild(iframeForYT)
// })
