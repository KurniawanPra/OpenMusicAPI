import ApplicationError from "../../../core/errors/application-error.js"

const errorHandler = (request, h) => {
  const { response } = request

  if (response instanceof ApplicationError) {
    const newResponse = h.response({
      status: "fail",
      message: response.message,
    })
    newResponse.code(response.statusCode)
    return newResponse
  }

  return h.continue
}

export default errorHandler

