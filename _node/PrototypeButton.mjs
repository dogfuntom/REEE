/**
 * A button wrapper that acts in a way that is currently most handy for prototyping.
 * Atm this means it uses its own text to show statuses (log) or errors to user (tester).
 */
// todo: the name refers to prototype in the sense of MVP, not the pattern, and this is confusing, better rename
export default class PrototypeButton {
  /**
   * @param {HTMLButtonElement} button
   */
  constructor (button) {
    /** @type {HTMLButtonElement} */
    this.button = button;
    this.initialText = null;
  }

  /**
   * @param {function} handler - Event handler, expected to be async (or return Promise) but probably will work regardless.
   */
  set onclick (handler) {
    this.button.onclick = async (ev) => {
      try {
        this.initialText = this.initialText ?? this.button.innerText

        this.button.disabled = true;
        const result = await handler()
        this.button.innerText = String(result ?? this.initialText)
      } catch (error) {
        if (error instanceof Error){
          this.button.innerText = error.toString()
        } else {
          this.button.innerText = JSON.stringify(error)
        }
      } finally {
        this.button.disabled = false;
      }
    }
  }
}
