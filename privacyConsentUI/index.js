import { closeSelfAsync } from './privacyConsent.mjs'
/* global browser */

// async function closeSelfAsync () {
//   try {
//     const windowId = (await browser.windows.getCurrent()).id
//     await browser.windows.remove(windowId)
//     // this point will never be reached, since the window is gone
//     //
//   } catch (error) { console.error('Closing failed:', error) }
// }

/** @type {HTMLButtonElement} */
const yes = window.document.getElementById('yes')
yes.onclick = async () => {
  browser.tabs.create({ url: '../recommendationsPage/index.html' })
  await closeSelfAsync()
}
yes.onkeydown = yes.onclick

/** @type {HTMLButtonElement} */
const no = window.document.getElementById('no')
no.onclick = async () => {
  browser.windows.create({ url: './denied.html', type: 'popup', height: 600, width: 600 })
  await closeSelfAsync()
}
no.onkeydown = no.onclick

yes.focus()
