export default class RecommendationsView {
  /** @param {HTMLElement} section */
  constructor (section) {
    this.section = section
    /** @type {HTMLElement[]} */
    this.recommendations = []
  }

  /** @param {string[]} recommendations */
  changeRecommendations (recommendations) {
    for (const elem of this.recommendations) {
      elem.remove()
    }
    this.recommendations = []

    for (const strIdent of recommendations) {
      const li = window.document.createElement('li')

      /** @type {HTMLAnchorElement} */
      const a = window.document.createElement('a')
      a.href = 'https://youtu.be/' + strIdent
      a.target = '_blank'
      a.textContent = a.href

      li.appendChild(a)
      this.section.appendChild(li)
      this.recommendations.push(li)
    }
  }
}
