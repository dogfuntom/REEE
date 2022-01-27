/**
 * Attempts to connect to all ports with provided IDs.
 * After all but one fail, the one remaining is returned.
 * Note that the last one may still fail, this function doesn't care as long as it's last to fail.
 * If more than one won't fail, the promise will never proceed.
 * @param {string[]} ids
 * @returns {Promise<browser.runtime.Port>} A port in the middle of establishing connection. It may fail to connect.
 */
export default async function connectToAnyAsync(ids) {
  if (ids.length < 2) console.warn('At least 2 items are recommended.')

  // Chrome docs lie about runtime.connect().
  // When id doesn't exists, it throws a TypeError, instead of only firing onDisconnect.
  // But Firefox follows it literally: no exception, just onDisconnect is fired.
  let ports = ids.map(id => tryConnect(id)).filter(p => p)
  switch (ports.length) {
    case 0:
      return null
    case 1:
      return ports[0]
    default:
      break;
  }
  if (ports.length === 1) return Promise.resolve(ports[0])

  // NOTE: If get the port by the process of elimination
  // (in the case of Firefox, exactly this situation arises),
  // then we still can't be sure that the remaining port is valid.
  return new Promise(resolve => {
    for (const port of ports) {
      port.onDisconnect.addListener(discoPort => {
        ports = ports.filter(p => p !== discoPort)
        if (ports.length === 1) resolve(ports[0])
      })
    }
  })
}

// (See comment at call-site.)
function tryConnect (id) {
  try {
    return browser.runtime.connect(id)
  } catch (error) {
    if (error instanceof TypeError) return null
    throw error
  }
}
