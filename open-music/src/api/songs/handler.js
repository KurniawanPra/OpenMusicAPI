import autoBind from "auto-bind"

class SongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator
    autoBind(this)
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload)
    const songId = await this._service.addSong(request.payload)

    const response = h.response({
      status: "success",
      data: { songId },
    })

    response.code(201)
    return response
  }

  async getSongsHandler(request, h) {
    const { title = "", performer = "" } = request.query
    await this._validator.validateSongQuery({ title, performer })
    const songs = await this._service.getSongs({ title, performer })

    return h.response({
      status: "success",
      data: { songs },
    })
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)

    return h.response({
      status: "success",
      data: { song },
    })
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload)
    const { id } = request.params
    await this._service.editSongById(id, request.payload)

    return h.response({
      status: "success",
      message: "Song updated successfully",
    })
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)

    return h.response({
      status: "success",
      message: "Song deleted successfully",
    })
  }
}

export default SongsHandler

