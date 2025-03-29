import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class AlbumController {
  constructor(albumRepository, songRepository) {
    this.albumRepository = albumRepository
    this.songRepository = songRepository
  }

  async createAlbum(request, h) {
    SchemaValidator.validate(SchemaValidator.albumSchema, request.payload)

    const { name, year } = request.payload
    const albumId = await this.albumRepository.create({ name, year })

    const response = h.response({
      status: "success",
      message: "Album created successfully",
      data: {
        albumId,
      },
    })
    response.code(201)
    return response
  }

  async getAlbumById(request) {
    const { id } = request.params
    const album = await this.albumRepository.findById(id)
    const songs = await this.songRepository.findByAlbumId(id)

    return {
      status: "success",
      data: {
        album: {
          ...album,
          songs,
        },
      },
    }
  }

  async updateAlbum(request) {
    SchemaValidator.validate(SchemaValidator.albumSchema, request.payload)

    const { id } = request.params
    await this.albumRepository.update(id, request.payload)

    return {
      status: "success",
      message: "Album updated successfully",
    }
  }

  async deleteAlbum(request) {
    const { id } = request.params
    await this.albumRepository.delete(id)

    return {
      status: "success",
      message: "Album deleted successfully",
    }
  }
}

export default AlbumController

