/* global browser */

export async function closeSelfAsync () {
  try {
    const windowId = await getSelfIdAsync()
    await browser.windows.remove(windowId)
    // Note that code after this comment will never be reached, since the window is gone.
  } catch (error) { console.error('Closing failed:', error) }
}

async function getSelfIdAsync () {
  return (await browser.windows.getCurrent()).id
}
