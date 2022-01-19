// @ts-check
import { tryGetSnippet, toThumbnailUrl } from './YT.mjs'

const recommendationsCap = 1000
const eagerCount = 1

const thumbnailSize = 'mq'
const thumbnailWidth = 320
const thumbnailHeight = 180

export default class RecommendationsView {
  /**
   * @param {HTMLElement} section
   * @param {Object} cardProps
   * @param {string} [cardProps.tagName=aside]
   * @param {string} [cardProps.className]
   * @param {boolean} [cardProps.wrapInDiv=false]
   */
  constructor (section, { tagName, className, wrapInDiv }) {
    this.tagName = tagName ?? 'aside'
    this.className = className ?? ''
    this.wrapInDiv = wrapInDiv ?? false

    this.section = section
    /** @type {HTMLElement[]} */
    this.recommendations = []
  }

  /** @param {string[]} recommendations */
  changeRecommendations (recommendations) {

    /**
     * @param {string} strIdent
     */
    function makeThumbnailAnchor (strIdent) {
      /** @type {HTMLAnchorElement} */
      const a = window.document.createElement('a')
      a.href = 'https://youtu.be/' + strIdent
      a.target = '_blank'
      a.referrerPolicy = 'no-referrer'
      a.rel = 'nofollow noopener norefferer'
      return a
    }

    for (const elem of this.recommendations) {
      elem.remove()
    }
    this.recommendations = []

    // for (const strIdent of recommendations) {
    for (let i = 0; i < Math.min(recommendationsCap, recommendations.length); i++) {
      const strIdent = recommendations[i]

      const { wrapper, itemContainer } = makeCard(this.tagName, this.className, this.wrapInDiv)
      const a = makeThumbnailAnchor(strIdent)
      const img = makeThumbnail(strIdent, i >= eagerCount)

      a.appendChild(img)
      itemContainer.appendChild(a)
      itemContainer.appendChild(addTextualDataInParallel(strIdent, img))

      this.section.appendChild(wrapper)
      this.recommendations.push(wrapper)
    }
  }
}

/**
 * @param {string} tagName
 * @param {string} className
 * @param {boolean} wrapInDiv
 */
function makeCard (tagName, className, wrapInDiv) {
  const el = window.document.createElement(tagName)
  el.className = className

  if (wrapInDiv) {
    const div = window.document.createElement('div')
    div.appendChild(el)
    return {
      wrapper: div,
      itemContainer: el
    }
  }

  return {
    wrapper: el,
    itemContainer: el
  }
}

/**
 * @param {string} strIdent
 * @param {boolean} [lazyLoading]
 */
function makeThumbnail (strIdent, lazyLoading) {
  lazyLoading = (lazyLoading === true)

  /** @type {HTMLImageElement} */
  const img = new Image()
  img.src = toThumbnailUrl(strIdent, thumbnailSize)
  img.width = thumbnailWidth
  img.height = thumbnailHeight
  img.referrerPolicy = 'no-referrer'
  img.alt = 'thumbnail of video'

  img.loading = lazyLoading ? 'lazy' : 'eager'
  return img
}

/**
 * @param {string} strIdent
 * @param {HTMLImageElement} img
 */
function addTextualDataInParallel (strIdent, img) {
  const p = window.document.createElement('p')
  // p.textContent = ' '

  // Fire and forget, we don't care about waiting for it.
  tryGetSnippet(strIdent)
    .then(s => {
      if (!s) {
        p.appendChild(document.createTextNode('< n/a >'))
        return
      }

      p.appendChild(document.createTextNode(s.title))
      p.appendChild(document.createTextNode(' <'))

      const channelTitle = document.createElement('strong')
      channelTitle.appendChild(document.createTextNode(s.channelTitle))
      p.appendChild(channelTitle)

      p.appendChild(document.createTextNode(', '))
      p.appendChild(document.createTextNode(s.publishedAt.substring(0, 4)))

      p.appendChild(document.createTextNode('>'))

      // img.alt = s.description
    })
    .catch(console.error)

  return p
}
