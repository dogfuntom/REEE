/* global browser */

browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  // Do not skip in order to test this.
  // if (temporary) return; // skip during development
  switch (reason) {
    case 'install':
      {
        const url = browser.runtime.getURL('privacyConsentUI/index.html')
        await browser.windows.create({ url, type: 'popup', height: 600, width: 1024 })
      }
      break
  }
})

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: './recommendationsPage/index.html' })
})
