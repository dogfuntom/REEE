/**
 * Module for Youtube-specific code.
 * @module
 */

// @todo a class is not needed?
export default class YT {
  /**
   * @param {string} strIdent
   */
  static async getTitle (strIdent) {
    // const url = YT.toVideoUrl(strIdent)
    // const response = await fetch(url)

    // const reader = response.body.getReader()
    // let html = ''

    // while (true) {
    //   const { value, done } = await reader.read()
    //   if (done) break;

    //   html += value
    //   if (html.match(/<\/title>/i)) break
    // }

    // Note that API key is not a secret, so it's fine to have it in code.
    // (It's public anyway because extensions are incredibly easy to "disassembly".
    // Instead, key usage can be secured on the key management side at the Google dashboard.)
    const apiKey = 'AIzaSyB5MZ1y0npeb4F5XiNorrh8WqrkgcGvOKo'
    // @todo this can be optimized by passing multiple ids (comma separated)
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${strIdent}&key=${apiKey}`
    const response = await fetch(url)

    /** @type {SnippetResponse} */
    const json = await response.json()
    return json.items[0]?.snippet?.title
  }

  // /**
  //  * @param {string} strIdent
  //  */
  // static toVideoUrl (strIdent) {
  //   return 'https://youtu.be/' + String(strIdent)
  // }

  /**
   * @param {string} strIdent
   * @param {string} [size=mq] hq, mq or empty string
   */
  static toThumbnailUrl (strIdent, size) {
    strIdent = String(strIdent)
    size = String(size ?? 'mq')
    // return 'http://i3.ytimg.com/vi/' + String(strIdent) + '/mqdefault.jpg'
    return `http://i3.ytimg.com/vi/${strIdent}/${size}default.jpg`
  }
}

/**
 * @typedef {Object} Snippet
 * @property {string} title
 */

/**
 * @typedef {Object} SnippetResponse
 * @property {{ snippet: Snippet }[]} items
 */
