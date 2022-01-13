/**
 * Module for Youtube-specific code.
 * @module
 */

/**
 * @param {string} strIdent
 * @returns {Promise<Snippet>}
 */
export async function getSnippet (strIdent) {
  // Note that API key is not a secret, so it's fine to have it in code.
  // (It's public anyway because extensions are incredibly easy to "disassembly".
  // Instead, key usage can be secured on the key management side at the Google dashboard.)
  const apiKey = 'AIzaSyB5MZ1y0npeb4F5XiNorrh8WqrkgcGvOKo'
  // @todo this can be optimized by passing multiple ids (comma separated)
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${strIdent}&key=${apiKey}`
  const response = await fetch(url)

  /** @type {SnippetResponse} */
  const json = await response.json()
  return json.items[0]?.snippet
}

/**
 * @param {string} strIdent
 * @param {string} [size=mq] hq, mq or empty string
 */
export function toThumbnailUrl (strIdent, size) {
  strIdent = String(strIdent)
  size = String(size ?? 'mq')
  // return 'http://i3.ytimg.com/vi/' + String(strIdent) + '/mqdefault.jpg'
  return `http://i3.ytimg.com/vi/${strIdent}/${size}default.jpg`
}

/**
 * @typedef {Object} Snippet
 * @property {string} publishedAt ISO 8601
 * @property {string} channelId
 * @property {string} title Maximum length of 100 characters and may contain all valid UTF-8 characters except < and >
 * @property {string} description Maximum length of 5000 bytes and may contain all valid UTF-8 characters except < and >
 * @property {string} channelTitle
 * @property {string} categoryId
 * @property {string} liveBroadcastContent live|none|upcoming
 * @property {Array<string>} [tags] @todo not sure if available
 */

/**
 * @typedef {Object} SnippetResponse
 * @property {{ snippet: Snippet }[]} items
 */
