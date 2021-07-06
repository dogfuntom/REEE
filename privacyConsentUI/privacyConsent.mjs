/* global browser */

export async function closeSelfAsync () {
  try {
    const windowId = (await browser.windows.getCurrent()).id
    await browser.windows.remove(windowId)
    // this point will never be reached, since the window is gone
    //
  } catch (error) { console.error('Closing failed:', error) }
}
