/** @enum {number} */
export const StatusType = {
  LoadingLong: -2,
  Loading: -1,
  OK: 0,
  NoUser: 1,
  EmptyHistory: 2,
  OtherError: 3
}
Object.freeze(StatusType)

export class StatusView {
  constructor ({ loading, loadingLong, noUser, emptyHistory, otherError, otherErrorContent }) {
    /** @type {HTMLElement} */
    this.otherErrorContent = otherErrorContent

    /** @type {Map<StatusType, HTMLElement>} */
    this.map = new Map()
    this.map.set(StatusType.Loading, loading)
    this.map.set(StatusType.LoadingLong, loadingLong)
    this.map.set(StatusType.OK, null)
    this.map.set(StatusType.NoUser, noUser)
    this.map.set(StatusType.EmptyHistory, emptyHistory)
    this.map.set(StatusType.OtherError, otherError)
  }

  /** @property {number} status */
  showStatus (statusType) {
    for (const element of this.map.values()) {
      if (element) { element.hidden = true }
    }

    const element = this.map.get(statusType)
    if (element) { element.hidden = false }

    if (statusType === StatusType.OtherError) { console.warn('For other errors showOtherError() should be used.') } else { this.otherErrorContent.textContent = '' }
  }

  showOtherError (text) {
    for (const element of this.map.values()) {
      if (element) { element.hidden = true }
    }

    const element = this.map.get(StatusType.OtherError)
    if (element) { element.hidden = false }

    this.otherErrorContent.textContent = text
  }
}
