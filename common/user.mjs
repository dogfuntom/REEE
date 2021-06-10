// @ts-check
/* global browser */

// From here: https://stackoverflow.com/a/23854032/776442
/** @returns {string} */
function getRandomToken () {
  // E.g. 8 * 32 = 256 bits token
  const randomPool = new Uint8Array(32)
  window.crypto.getRandomValues(randomPool)
  let hex = ''
  for (let i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16)
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex
}

/** @returns {Promise} */
export async function getUserIdentAsync () {
  if (!browser.storage) throw Error('Permission for using storage is needed.')

  const items = await browser.storage.sync.get('userIdent').catch(console.error)
  if (items && items.userIdent) {
    return items.userIdent
  } else {
    const userIdent = getRandomToken()
    await browser.storage.sync.set({ userIdent: userIdent })
    return userIdent
  }
}

/**
 * @param {Array} objResults
 * @returns {Array}
 */
function convertHistorySearchResultsToReeeFormat (objResults) {
  const objVideos = []

  for (const objResult of objResults) {
    if (objResult.url.indexOf('https://www.youtube.com/watch?v=') !== 0) {
      continue
    } else if ((objResult.title === undefined) || (objResult.title === null)) {
      continue
    }

    if (objResult.title.indexOf(' - YouTube') === objResult.title.length - 10) {
      objResult.title = objResult.title.slice(0, -10)
    }

    objVideos.push({
      strIdent: objResult.url.substr(32, 11),
      intTimestamp: objResult.lastVisitTime,
      strTitle: objResult.title,
      intCount: objResult.visitCount
    })
  }

  return objVideos
}

/** @returns {Promise<Object>} */
export async function makeHistoryPostAsync () {
  console.group(makeHistoryPostAsync.name + '() has been called.')

  const userIdent = await getUserIdentAsync()
  console.log('User Identificator is: ' + userIdent)

  const objResults = await browser.history.search({
    text: 'https://www.youtube.com/watch?v=',
    startTime: 0
  })
  console.log(`Found ${objResults.length} YT video pages in browser history.`)

  const userHistory = convertHistorySearchResultsToReeeFormat(objResults)
  console.log(`Converted ${userHistory.length} YT video page entries (from browser history).`)

  console.groupEnd()
  return { userIdent, userHistory }
}
