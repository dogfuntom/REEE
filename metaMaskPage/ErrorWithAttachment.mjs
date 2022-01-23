// @ts-check
export default class ErrorWithAttachment extends Error {
  /**
   * @param {string} message
   * @param {unknown} attachment
   */
  constructor(message, attachment) {
    super(message);
    this.attachment = attachment;
  }

  /**
   * @param {(message?: any, ...optionalParams: any[]) => void} [method]
   */
  logSelf(method) {
    if (!method)
      method = console.error;
    method(this.message, this.attachment);
  }

  toString() {
    return `
Error: ${this.message}
More Info: ${JSON.stringify(this.attachment)}.`;
  }
}
