/* global browser */

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: './recommendationsPage/index.html' })
})
