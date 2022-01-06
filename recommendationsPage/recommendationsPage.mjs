import RecommendationsView from "./RecommendationsView.js";
import { StatusType, StatusView } from "./StatusView.js";
import { profile, profileEnd } from './profile.mjs'
import authAsync from "../common/auth.js";
import RecommendationsBackend from "./RecommendationsBackend.mjs";
import ensureConsentIsAskedAsync from "../privacyConsent/privacyConsent.js";
import { makeHistoryPostAsync } from "../common/user.js";

const baseUrl = 'https://api.reee.uk/'

/*
 * Opening "algorithm":
 * If cache exists, show cache, status is ok.
 * Otherwise, show random, status is 'please refresh'.
 */

/*
 * Refreshing "algorithm":
 * 0. Show the privacy stuff if didn't yet.
 * 1. Status is loading.
 * 2. Upload history.
 * 3. Get and show new recs.
 * 4. Status is ok.
 */

/**
 * @type {RecommendationsBackend}
 */
let rb

const statusView = new StatusView(
  window.document.getElementById('loading'),
  window.document.getElementById('noUser'),
  window.document.getElementById('emptyHistory'),
  window.document.getElementById('otherError'),
  window.document.getElementById('otherErrorContent')
)
const recommendationsView = new RecommendationsView(window.document.getElementById('container'))

const refreshButton = /** @type {HTMLButtonElement} */ (window.document.getElementById('refresh'))

refreshButton.disabled = true
const initPromise =
  initAsync(statusView, recommendationsView)
  .catch(e => statusView.showOtherError(e))
  .finally(() => refreshButton.disabled = false)

// (We continue always here instead of only on init success, but there should be no harm in that.)
initPromise
  .then(() => {
    refreshButton.onclick = async () => {
      try {
        refreshButton.disabled = true
        await refreshAsync(statusView, recommendationsView)
      } catch (error) {
        statusView.showOtherError(error)
        throw error
      } finally {
        refreshButton.disabled = false
      }
    }
  })

/**
 * @param {StatusView} statusView
 * @param {RecommendationsView} recommendationsView
 * @returns {Promise}
 */
async function initAsync (statusView, recommendationsView) {
  const randomCap = 20

  profile(authAsync.name)
  const token = await authAsync(baseUrl)
  profileEnd(authAsync.name)

  rb = new RecommendationsBackend(baseUrl, token)

  // Show cache (if exists).
  let recs = await rb.loadCachedRecommendationsAsync()

  // Otherwise, show random.
  if (!recs || recs.length < 1) {
    recs = await rb.fetchRandomPopularAsync()
    capCount(recs, randomCap)
    statusView.showStatus(StatusType.NoUser)
  }

  recommendationsView.changeRecommendations(recs)
  statusView.showStatus(StatusType.OK)
}

/**
 * @param {StatusView} statusView
 * @param {RecommendationsView} recommendationsView
 * @returns {Promise}
 */
async function refreshAsync (statusView, recommendationsView) {
  if (!rb) throw new Error(`${refreshAsync.name}() was called before ${initAsync.name}() was done.`)

  // Privacy dialogs.
  if (!await ensureConsentIsAskedAsync()) return
  statusView.showStatus(StatusType.Loading)

  // Upload history
  const data = await makeHistoryPostAsync()
  if (data.userHistory.length === 0) {
    statusView.showStatus(StatusType.EmptyHistory)
    console.log('History is empty, showing empty history status.')
    return
  }
  await rb.uploadHistoryAsync(data)

  // Load the actual recommendations and show them.
  const recs = await rb.fetchRecommendationsAsync()
  recommendationsView.changeRecommendations(recs)
  statusView.showStatus(StatusType.OK)
}

/**
 * Leaves only specified number of items.
 * WARNING: works in place.
 * @param {string[]} items
 * @param {number} cap
 */
async function capCount (items, cap) {
  while (items.length > cap) {
    const index = Math.floor(Math.random() * items.length)
    items.splice(index, 1)
  }
}
