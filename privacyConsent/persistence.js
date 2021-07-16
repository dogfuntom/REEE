/* global browser */

export const privacyConsentKey = 'privacyConsent'

/** @returns {Promise} */
export function applyPrivacyConsentAsync () { return browser.storage.local.set({ [privacyConsentKey]: true }) }

/** @returns {Promise<boolean>} */
export async function getPrivacyConsentAsync () {
  const items = await browser.storage.local.get(privacyConsentKey)
  return (items && (items[privacyConsentKey] === true))
}
