/**
 * A button wrapper that acts in a way that is currently most handy for prototyping.
 * Atm this means it uses its own text to show statuses (log) or errors to user (tester).
 */
export default class PrototypeButton {
  /**
   * @param {HTMLButtonElement} button
   */
  constructor (button) {
    /** @type {HTMLButtonElement} */
    this.button = button
  }

  /**
   * @param {function} handler - Event handler, expected to be async (or return Promise) but probably will work regardless.
   */
  set onclick (handler) {
    this.button.onclick = async () => {
      try {
        this.initialText ??= this.button.innerText

        this.button.disabled = true;
        const result = await handler()
        this.button.innerText = String(result ?? this.initialText)
      } catch (error) {
        this.button.innerText = String(error)
      } finally {
        this.button.disabled = false;
      }
    }
  }
}
