/* global browser */

/** @type {HTMLButtonElement} */ // @ts-ignore
const remove = window.document.getElementById('remove')
remove.onclick = remove.onkeydown = () => { browser.management.uninstallSelf() }

/** @type {HTMLButtonElement} */ // @ts-ignore
const revisit = window.document.getElementById('revisit')
revisit.onclick = async () => {
  revisit.disabled = true
  const id = (await browser.tabs.getCurrent()).id
  browser.tabs.goBack(id)
}
