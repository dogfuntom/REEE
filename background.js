/* global browser */

// deno-lint-ignore no-unused-vars
browser.runtime.onInstalled.addListener(({ reason, temporary }) => {
  // Comment or uncomment, depending on what is tested atm.
  // if (temporary) return // skip during development

  switch (reason) {
    case 'install':
      break
  }
})

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({ url: './recommendationsPage/index.html' })
})
