import { closeSelfAsync } from './privacyConsent.mjs'
/* global browser */

async function switchToDeniedAsync () {
  await browser.windows.create({ url: './denied.html', type: 'popup', height: 500, width: 600 })
  closeSelfAsync()
}

window.addEventListener('beforeunload', switchToDeniedAsync)

/** @type {HTMLButtonElement} */
const yes = window.document.getElementById('yes')
yes.onclick = () => {
  browser.tabs.create({ url: '../recommendationsPage/index.html' })
  window.removeEventListener('beforeunload', switchToDeniedAsync)
  closeSelfAsync()
}
yes.onkeydown = yes.onclick

/** @type {HTMLButtonElement} */
const no = window.document.getElementById('no')
no.onkeydown = no.onclick = () => {
  no.disabled = true
  switchToDeniedAsync()
}
