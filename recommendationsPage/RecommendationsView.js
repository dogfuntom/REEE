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

    function makeAnchor (strIdent) {
      /** @type {HTMLAnchorElement} */
      const a = window.document.createElement('a')
      a.href = 'https://youtu.be/' + strIdent
      a.target = '_blank'
      return a
    }

    /**
     * @param {string} strIdent
     */
    function makeImg (strIdent) {
      /** @type {HTMLImageElement} */
      const img = new Image()
      img.alt = 'thumbnail for Youtube video with id =' + String(strIdent)
      img.src = 'http://i3.ytimg.com/vi/' + String(strIdent) + '/hqdefault.jpg'
      return img
    }

    for (const elem of this.recommendations) {
      elem.remove()
    }
    this.recommendations = []

    for (const strIdent of recommendations) {
      const container = // window.document.createElement('li')
        makeContainer()
      const a = makeAnchor(strIdent)
      const img = makeImg(strIdent)

      a.appendChild(img)
      container.appendChild(a)
      this.section.appendChild(container)
      this.recommendations.push(container)
    }
  }
}
