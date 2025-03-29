import ApplicationError from "./application-error.js"

class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(message, 403)
    this.name = "ForbiddenError"
  }
}

export default ForbiddenError

