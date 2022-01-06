import { getUserIdentAsync } from '../common/user.js'
import { profile, profileEnd } from './profile.mjs'

export default class RecommendationsBackend {
  /**
   * @param {string | URL} baseUrl
   * @param {string} token
   */
  constructor (baseUrl, token) {
    this.base = baseUrl
    this.token = token
  }

  /**
   * @returns {Promise<string[]>}
   */
  async fetchRandomPopularAsync () {
    const userIdent = await getUserIdentAsync()
    const url = new URL(`./video_recommendation_d/users/${userIdent}/c9964f79246fc637e7e00d4e8de63f40`, this.base)

    const response = await fetch(url.href)
    console.debug(response)

    /** @type {VideoRecommendationResponseJson} */
    const json = await response.json()
    return filterValidStrIdents(json.video_strIndents)
  }

  /** @returns {Promise<string[]>} */
  loadCachedRecommendationsAsync () { return loadRecommendationCacheAsync() }

  /**
   * @param {boolean} [caching=true]
   * @returns
   */
  async fetchRecommendationsAsync (caching) {
    caching = caching ?? true

    const json = await fetchRecommendationsRawAsync(this.token, this.base);

    if (json.msg === 'the user is not registered in the system' || !json.video_strIndents || json.video_strIndents.length === 0) {
      throw new Error(json.msg)
    } else {
      const recs = filterValidStrIdents(json.video_strIndents)

      if (caching) await saveRecommendationCacheAsync(recs)
      return recs
    }
  }

  /**
   * @param {{ userIdent: string, userHistory: Array }} historyPost
   */
  async uploadHistoryAsync (historyPost) {
    const url = new URL('./video_recommendation/users/' + this.token, this.base)
    const response = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(historyPost)
    })

    if (!response.ok) throw response
  }
}

/**
 * @param {string[]} strIdents
 * @returns {string[]} */
function filterValidStrIdents (strIdents) {
  const re = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/
  return strIdents.filter(strIdent => re.test(strIdent))
}

/**
 * @param {string} token
 * @param {string | URL} base
 * @returns {Promise<VideoRecommendationResponseJson>}
 */
async function fetchRecommendationsRawAsync (token, base) {
  profile(getUserIdentAsync.name)
  const userIdent = await getUserIdentAsync()
  const url = new URL(`./video_recommendation/users/${userIdent}/${token}`, base)
  profileEnd(getUserIdentAsync.name)

  profile(fetch.name)
  const response = await fetch(url.href)
  console.debug(response)
  profileEnd(fetch.name)

  return response.json()
}

const recommendationsCacheKey = 'recommendations'

function saveRecommendationCacheAsync (ids) {
  return browser.storage.local.set({ [recommendationsCacheKey]: ids })
}

/**
 * @returns {Promise<string[]>}
 */
async function loadRecommendationCacheAsync () {
  return (
    await browser.storage.local.get({ [recommendationsCacheKey]: [] })
    )[recommendationsCacheKey]
}

/**
 * @typedef {Object} VideoRecommendationResponseJson
 * @prop {string[]} [video_strIndents]
 * @prop {number[]} [video_recommendation_score]
 * @property {string} msg
 */
