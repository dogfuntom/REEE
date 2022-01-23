// @ts-check

import { getUserIdentAsync } from "../common/user.js"
import Backend from "./Backend.mjs"
import ErrorWithAttachment from "./ErrorWithAttachment.mjs"
import MetaMaskFacade from "./metamask.mjs"

const backendUrl = 'https://reee-blockchain-k9uqc.ondigitalocean.app/'
// const backendUrl = 'http://localhost:3000'

const didSignInKey = 'didSignIn'

const backend = new Backend(backendUrl)

/**
 * @param {import("./provider.mjs").Provider} provider
 * @param {number} chainId
 * @param {(text: string) => void} [renderText] Callback that will show signed data to user.
 */
export async function signInAsync (provider, chainId, renderText) {
  if (!renderText) renderText = _ => { }

  await loginAsync(provider, chainId, renderText)

  // If we get here, then loginAsync() succeeded, because it throws otherwise.
  flagDidSignInAsync().catch(console.error)
}

/**
 * @param {import("./provider.mjs").Provider} provider
 * @param {number} chainId
 * @param {(text: string) => void} renderText
 */
async function loginAsync (provider, chainId, renderText) {
  const mmf = new MetaMaskFacade(provider)
  await mmf.initializeAsync()
  await loginImplAsync(await getUserIdentAsync(), mmf, chainId, renderText)
}

/**
 * @param {string} userIdent
 * @param {MetaMaskFacade} mmf
 * @param {number} chainId
 * @param {(text: string) => void} [ongoingStatusCallback]
 * @returns {Promise<boolean>}
 * @throws {ErrorWithAttachment | any}
 */
async function loginImplAsync (userIdent, mmf, chainId, ongoingStatusCallback) {
  if (!ongoingStatusCallback) ongoingStatusCallback = () => {}

  const publicAddress = mmf.account

  const nonce = await backend.getOrCreateNonce(userIdent)
  ongoingStatusCallback(nonce)

  const signature = await mmf.signAsync(userIdent, nonce, chainId)

  if (await backend.verify(userIdent, publicAddress, signature)) {
    return
  } else {
    throw new ErrorWithAttachment('Verification failed for unknown reason.', {
      userIdent,
      chainId,
      publicAddress,
      nonce,
      signature
    })
  }
}

export async function getDidSignInAsync () {
  const didSignIn = await browser.storage.local.get({ [didSignInKey]: false })
  return didSignIn[didSignInKey]
}

export async function flagDidSignInAsync () {
  await browser.storage.local.set({ [didSignInKey]: true })
}
