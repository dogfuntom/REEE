import { applyPrivacyConsentAsync } from '../persistence.js'
/* global browser */

/** @type {HTMLButtonElement} */ // @ts-ignore
const yes = window.document.getElementById('yes')
yes.onclick = yes.onkeydown = async () => {
  await applyPrivacyConsentAsync()
  await closeSelfAsync()
}

/** @type {HTMLButtonElement} */ // @ts-ignore
const no = window.document.getElementById('no')
no.onkeydown = no.onclick = async () => {
  const id = (await browser.tabs.getCurrent()).id

  // "To load a page that's packaged with your extension, specify an absolute URL starting at the extension's manifest.json file. For example: '/path/to/my-page.html'. If you omit the leading '/', the URL is treated as a relative URL, and different browsers may construct different absolute URLs."
  // see: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
  browser.tabs.update(id, { url: '/privacyConsent/UI/denied.html' })
}

async function closeSelfAsync () {
  async function getSelfIdAsync () {
    return (await browser.windows.getCurrent()).id
  }

  try {
    const windowId = await getSelfIdAsync()
    await browser.windows.remove(windowId)
    // Do not write code after this comment, it will never be reached, since the window is gone.
  } catch (error) { console.error('Closing failed:', error) }
}
