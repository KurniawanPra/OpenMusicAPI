import SchemaValidator from "../../../infrastructure/validation/schema-validator.js"

class SongController {
  constructor(songRepository) {
    this.songRepository = songRepository
  }

  async createSong(request, h) {
    SchemaValidator.validate(SchemaValidator.songSchema, request.payload)

    const { title, year, genre, performer, duration, albumId } = request.payload

    const songId = await this.songRepository.create({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    })

    const response = h.response({
      status: "success",
      message: "Song created successfully",
      data: {
        songId,
      },
    })
    response.code(201)
    return response
  }

  async getSongs(request) {
    const { title, performer } = request.query
    const songs = await this.songRepository.findAll({ title, performer })

    return {
      status: "success",
      data: {
        songs,
      },
    }
  }

  async getSongById(request) {
    const { id } = request.params
    const song = await this.songRepository.findById(id)

    return {
      status: "success",
      data: {
        song,
      },
    }
  }

  async updateSong(request) {
    SchemaValidator.validate(SchemaValidator.songSchema, request.payload)

    const { id } = request.params
    await this.songRepository.update(id, request.payload)

    return {
      status: "success",
      message: "Song updated successfully",
    }
  }

  async deleteSong(request) {
    const { id } = request.params
    await this.songRepository.delete(id)

    return {
      status: "success",
      message: "Song deleted successfully",
    }
  }
}

export default SongController

