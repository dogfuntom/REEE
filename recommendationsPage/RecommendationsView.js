// @ts-check
import YT from './YT.mjs'

const recommendationsCap = 1000
const eagerCount = 1

export default class RecommendationsView {
  /** @param {HTMLElement} section */
  constructor (section) {
    this.section = section
    /** @type {HTMLElement[]} */
    this.recommendations = []
  }

  /** @param {string[]} recommendations */
  changeRecommendations (recommendations) {
    function makeContainer () {
      const aside = window.document.createElement('aside')
      return aside
    }

    function makeThumbnailAnchor (strIdent) {
      /** @type {HTMLAnchorElement} */
      const a = window.document.createElement('a')
      a.href = 'https://youtu.be/' + strIdent
      a.target = '_blank'
      return a
    }

    /**
     * @param {string} strIdent
     * @param {boolean} [lazyLoading]
     */
    function makeThumbnail (strIdent, lazyLoading) {
      lazyLoading = (lazyLoading === true)

      /** @type {HTMLImageElement} */
      const img = new Image()
      img.alt = 'thumbnail for Youtube video with id =' + String(strIdent)
      img.src = YT.toThumbnailUrl(strIdent)
      img.loading = lazyLoading ? 'lazy' : 'eager'
      return img
    }

    function makeTitleParagraphInParallel (strIdent) {
      const p = window.document.createElement('p')
      p.textContent = ' '

      // Fire and forget, we don't care about waiting for it.
      YT.getTitle(strIdent)
        .then(t => p.textContent = t ?? 'n/a')
        .catch(console.error)

      return p
    }

    for (const elem of this.recommendations) {
      elem.remove()
    }
    this.recommendations = []

    // for (const strIdent of recommendations) {
    for (let i = 0; i < Math.min(recommendationsCap, recommendations.length); i++) {
      const strIdent = recommendations[i]

      const container =
        makeContainer()
      const a = makeThumbnailAnchor(strIdent)
      const img = makeThumbnail(strIdent, i >= eagerCount)

      a.appendChild(img)
      container.appendChild(a)
      container.appendChild(makeTitleParagraphInParallel(strIdent))

      this.section.appendChild(container)
      this.recommendations.push(container)
    }
  }
}
