import { closeSelfAsync } from './privacyConsent.js'
/* global browser */

function uninstallSelf () {
  browser.management.uninstallSelf()
}
window.addEventListener('beforeunload', uninstallSelf)

/** @type {HTMLButtonElement} */
const remove = window.document.getElementById('remove')
// Just close self, the event handler on beforeunload will deal with uninstallation.
remove.onclick = closeSelfAsync
remove.onkeydown = remove.onclick

/** @type {HTMLButtonElement} */
const revisit = window.document.getElementById('revisit')
revisit.onclick = async () => {
  revisit.disabled = true
  window.removeEventListener('beforeunload', uninstallSelf)
  browser.windows.create({ url: './index.html', type: 'popup', height: 600, width: 600 })
  await closeSelfAsync()
}
