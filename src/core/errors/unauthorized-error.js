import ApplicationError from "./application-error.js"

class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(message, 401)
    this.name = "UnauthorizedError"
  }
}

export default UnauthorizedError

