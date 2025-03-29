import config from "./utils/config.js"
import { server as HapiServer } from "@hapi/hapi"
import Jwt from "@hapi/jwt"
import Inert from "@hapi/inert"
import ClientError from "./exceptions/ClientError.js"

// API plugins
import albums from "./api/albums/index.js"
import songs from "./api/songs/index.js"
import users from "./api/users/index.js"
import authentications from "./api/authentications/index.js"
import playlists from "./api/playlists/index.js"
import playlistsongs from "./api/playlistsongs/index.js"
import collaborations from "./api/collaborations/index.js"
import activities from "./api/activities/index.js"
import exports from "./api/exports/index.js"
import likes from "./api/likes/index.js"

// Services
import AlbumsService from "./services/AlbumsService.js"
import SongsService from "./services/SongsService.js"
import UsersService from "./services/UsersService.js"
import AuthenticationsService from "./services/AuthenticationsService.js"
import PlaylistsService from "./services/PlaylistsService.js"
import PlaylistSongsService from "./services/PlaylistSongsService.js"
import CollaborationsService from "./services/CollaborationsService.js"
import ActivitiesService from "./services/ActivitiesService.js"
import ProducerService from "./services/ProducerService.js"
import StorageServices from "./services/StorageServices.js"
import CacheService from "./services/CacheService.js"
import LikesService from "./services/LikesService.js"

// Validators
import AlbumsValidator from "./validator/albums/index.js"
import SongValidator from "./validator/songs/index.js"
import UsersValidator from "./validator/users/index.js"
import AuthenticationsValidator from "./validator/authentications/index.js"
import PlaylistsValidator from "./validator/playlists/index.js"
import PlaylistSongsValidator from "./validator/playlistsongs/index.js"
import CollaborationsValidator from "./validator/collaborations/index.js"
import ExportsValidator from "./validator/exports/index.js"

// Tokenize
import TokenManager from "./tokenize/TokenManager.js"
import { resolve } from "path"

const init = async () => {
  // Initialize services
  const cacheService = new CacheService()
  const storageService = new StorageServices(resolve(process.cwd(), "storage/images"))
  const albumsService = new AlbumsService(cacheService)
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService(usersService, cacheService)
  const playlistsService = new PlaylistsService(collaborationsService, cacheService)
  const playlistSongsService = new PlaylistSongsService(songsService, cacheService)
  const activitiesService = new ActivitiesService()
  const producerService = new ProducerService()
  const likesService = new LikesService(cacheService)

  // Create server
  const server = new HapiServer({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  })

  // Register external plugins
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ])

  // Configure authentication
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: config.auth.accessKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.auth.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  })

  // Register API plugins
  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        storageService,
        cacheService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        service: authenticationsService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        cacheService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsService,
        playlistSongsService,
        activitiesService,
        cacheService,
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: activities,
      options: {
        activitiesService,
        playlistsService,
      },
    },
    {
      plugin: exports,
      options: {
        producerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: likes,
      options: {
        likesService,
        albumsService,
        cacheService,
      },
    },
  ])

  // Error handling
  server.ext("onPreResponse", (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        })

        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: "fail",
        message: "The server has encountered a situation it does not know how to handle",
      })

      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`[INFO] Server running on ${server.info.uri}`)
}

init()

