import ApplicationError from "./application-error.js"

class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400)
    this.name = "ValidationError"
  }
}

export default ValidationError

