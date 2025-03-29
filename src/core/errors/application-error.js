class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = "ApplicationError"
  }
}

export default ApplicationError

