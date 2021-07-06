import { closeSelfAsync } from './privacyConsent.mjs'
/* global browser */

/** @type {HTMLButtonElement} */
const remove = window.document.getElementById('remove')
remove.onclick = () => {
  browser.management.uninstallSelf()
}
remove.onkeydown = remove.onclick

/** @type {HTMLButtonElement} */
const revisit = window.document.getElementById('revisit')
revisit.onclick = async () => {
  revisit.disabled = true
  browser.windows.create({ url: './index.html', type: 'popup', height: 600, width: 600 })
  await closeSelfAsync()
}
