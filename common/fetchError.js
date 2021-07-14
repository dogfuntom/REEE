export default class FetchError extends Error {
  constructor (...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // TODO: check if really needed (it shouldn't be needed accoring to this: https://onury.io/custom-error-test/)
    // needed for CustomError instanceof Error => true
    Object.setPrototypeOf(this, new.target.prototype)

    // Set the name
    this.name = this.constructor.name

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else if (!this.stack) {
      this.stack = (new Error()).stack
    }

    // Custom debugging information
    this.date = new Date()
  }
}

export class WrapperFetchError extends FetchError {
  constructor (inner, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    this.inner = inner
    this.name = this.constructor.name
  }

  static get [Symbol.species] () { return FetchError }

  /**
   * Wraps an error into WrapperFetchError,
   * unless it's already a FetchError.
   * @param {Error | any} error
   * @returns {FetchError}
   */
  static toFetchError (error) {
    if (error instanceof FetchError) {
      return error
    } else {
      return new WrapperFetchError(error)
    }
  }

  toString () {
    const outer = super.toString()
    return `${outer}\n ...with inner error: ${this.inner.toString()}`
  }
}
