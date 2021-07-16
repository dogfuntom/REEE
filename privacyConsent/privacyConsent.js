/* global browser */
import { getPrivacyConsentAsync } from './persistence.js'

let consentDialogPopupId = null
if (!browser.windows.onRemoved.hasListener(clearConsentDialogPopupId)) {
  browser.windows.onRemoved.addListener(clearConsentDialogPopupId)
}

/**
 * If consent was given, returns true.
 * Otherwise, launches the privacy consent dialog, and returns false.
 * (If dialog is already launched, then reuses it.)
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
export default async function ensureConsentIsAskedAsync () {
  if (!browser.storage) throw Error('Permission for using storage is needed.')

  if (await getPrivacyConsentAsync()) return true

  // Focus the existing popup if it is there.
  if (consentDialogPopupId) {
    await browser.windows.get(consentDialogPopupId)
      .then((window) => {
        browser.windows.update(window.id, { focused: true, state: 'normal' })
      }).catch((_) => {
        consentDialogPopupId = null
      })

    if (consentDialogPopupId) return false
  }

  // Show the popup and return false.
  const url = browser.runtime.getURL('privacyConsent/UI/index.html')
  const popup = await browser.windows.create({ url, type: 'popup', height: 600, width: 1024 })
  consentDialogPopupId = popup.id
  return false
}

function clearConsentDialogPopupId (window) {
  if (window.id === consentDialogPopupId) consentDialogPopupId = null
}
