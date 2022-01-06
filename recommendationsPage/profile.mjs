/**
 * Wrappers around console.profile() that handle its absence
 * It calls it only if it exists, doing nothing otherwise.
 * @module
*/

/**
 * @param {string} label
 */
export function profile (label) {
  const c = /** @type {Console | (Console & { profile: (label: string) => void })} */ (console)
  if ('profile' in c) c.profile(label)
}

/**
 * @param {string} label
 */
export function profileEnd (label) {
  const c = /** @type {Console | (Console & { profileEnd: (label: string) => void })} */ (console)
  if ('profileEnd' in c) c.profileEnd(label)
}
