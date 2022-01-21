/**
 * Attempts to connect to all ports with provided IDs.
 * After all but one fail, the one remaining is returned.
 * Note that the last one may still fail, this function doesn't care as long as it's last to fail.
 * If more than one won't fail, the promise will never proceed.
 * @param {string[]} ids
 * @returns {Promise<browser.runtime.Port>}
 */
export default async function connectToAnyAsync(ids) {
  if (ids.length < 2) console.warn('At least 2 items are recommended.')

  let ports = ids.map(id => browser.runtime.connect(id))

  return new Promise(resolve => {
    for (const port of ports) {
      port.onDisconnect.addListener(discoPort => {
        ports = ports.filter(p => p !== discoPort)
        if (ports.length === 1) resolve(ports[0])
      })
    }
  })
}
