import RecommendationsView from "./RecommendationsView.js";
import { StatusType, StatusView } from "./StatusView.js";
import { profile, profileEnd } from './profile.mjs'
import authAsync from "../common/auth.js";
import RecommendationsBackend from "./RecommendationsBackend.mjs";
import ensureConsentIsAskedAsync from "../privacyConsent/privacyConsent.js";
import { makeHistoryPostAsync } from "../common/user.js";

const baseUrl = 'https://api.reee.uk/'

const elementIds = {
  refreshButton: 'refresh',
  containerForResults: 'container',
}

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

const statusView = new StatusView({
  loading: window.document.getElementById('loading'),
  loadingLong: window.document.getElementById('loadingLong'),
  noUser: window.document.getElementById('noUser'),
  emptyHistory: window.document.getElementById('emptyHistory'),
  otherError: window.document.getElementById('otherError'),
  otherErrorContent: window.document.getElementById('otherErrorContent')
})
// @todo Consider making card's HTML closer to "idiomatic" pico.css cards.
// (I.e. wrap img-link into header, leave paragraph as is, tweak styles as needed.)
const recommendationsView = new RecommendationsView(
  window.document.getElementById(elementIds.containerForResults), {
    tagName: 'article',
    wrapInDiv: false
  }
)

const refreshButton = /** @type {HTMLButtonElement} */ (window.document.getElementById(elementIds.refreshButton))

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
  const recs = await rb.loadCachedRecommendationsAsync()

  // Otherwise, show random.
  if (!recs || recs.length < 1) {
    const pops = await rb.fetchRandomPopularAsync()
    capCount(pops, randomCap)

    recommendationsView.changeRecommendations(pops)
    statusView.showStatus(StatusType.NoUser)
    return
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

  statusView.showStatus(StatusType.LoadingLong)

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
