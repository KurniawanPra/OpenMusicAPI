import ApplicationError from "./application-error.js"

class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, 404)
    this.name = "NotFoundError"
  }
}

export default NotFoundError

