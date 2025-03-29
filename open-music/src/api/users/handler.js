import autoBind from "auto-bind"

class UsersHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    autoBind(this)
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload)
    const userId = await this._service.addUser(request.payload)

    const response = h.response({
      status: "success",
      data: { userId },
    })

    response.code(201)
    return response
  }
}

export default UsersHandler

