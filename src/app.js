import "dotenv/config"
import Hapi from "@hapi/hapi"
import Jwt from "@hapi/jwt"
import { Pool } from "pg"

// Import repositories
import AlbumRepository from "./infrastructure/database/album-repository.js"
import SongRepository from "./infrastructure/database/song-repository.js"
import UserRepository from "./infrastructure/database/user-repository.js"
import AuthRepository from "./infrastructure/database/auth-repository.js"
import PlaylistRepository from "./infrastructure/database/playlist-repository.js"
import PlaylistSongRepository from "./infrastructure/database/playlist-song-repository.js"
import CollaborationRepository from "./infrastructure/database/collaboration-repository.js"
import ActivityRepository from "./infrastructure/database/activity-repository.js"

// Import controllers
import AlbumController from "./interface/http/controllers/album-controller.js"
import SongController from "./interface/http/controllers/song-controller.js"
import UserController from "./interface/http/controllers/user-controller.js"
import AuthController from "./interface/http/controllers/auth-controller.js"
import PlaylistController from "./interface/http/controllers/playlist-controller.js"
import PlaylistSongController from "./interface/http/controllers/playlist-song-controller.js"
import CollaborationController from "./interface/http/controllers/collaboration-controller.js"
import ActivityController from "./interface/http/controllers/activity-controller.js"

// Import routes
import albumRoutes from "./interface/http/routes/album-routes.js"
import songRoutes from "./interface/http/routes/song-routes.js"
import userRoutes from "./interface/http/routes/user-routes.js"
import authRoutes from "./interface/http/routes/auth-routes.js"
import playlistRoutes from "./interface/http/routes/playlist-routes.js"
import playlistSongRoutes from "./interface/http/routes/playlist-song-routes.js"
import collaborationRoutes from "./interface/http/routes/collaboration-routes.js"
import activityRoutes from "./interface/http/routes/activity-routes.js"

// Import middleware
import errorHandler from "./interface/http/middleware/error-handler.js"

// Import token manager
import TokenManager from "./infrastructure/security/token-manager.js"

const init = async () => {
  const dbPool = new Pool()

  // Initialize repositories
  const albumRepository = new AlbumRepository(dbPool)
  const songRepository = new SongRepository(dbPool)
  const userRepository = new UserRepository(dbPool)
  const authRepository = new AuthRepository(dbPool)
  const playlistRepository = new PlaylistRepository(dbPool)
  const playlistSongRepository = new PlaylistSongRepository(dbPool)
  const collaborationRepository = new CollaborationRepository(dbPool)
  const activityRepository = new ActivityRepository(dbPool)

  // Initialize token manager
  const tokenManager = new TokenManager(
    process.env.ACCESS_TOKEN_KEY,
    process.env.REFRESH_TOKEN_KEY,
    process.env.ACCESS_TOKEN_AGE,
  )

  // Initialize controllers
  const albumController = new AlbumController(albumRepository, songRepository)
  const songController = new SongController(songRepository)
  const userController = new UserController(userRepository)
  const authController = new AuthController(authRepository, tokenManager, userRepository)
  const playlistController = new PlaylistController(playlistRepository, collaborationRepository, userRepository)
  const playlistSongController = new PlaylistSongController(
    playlistSongRepository,
    playlistRepository,
    songRepository,
    userRepository,
    collaborationRepository,
    activityRepository,
  )
  const collaborationController = new CollaborationController(
    collaborationRepository,
    playlistRepository,
    userRepository,
  )
  const activityController = new ActivityController(
    activityRepository,
    playlistRepository,
    collaborationRepository,
    userRepository,
    songRepository,
  )

  // Create server
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
  ])

  // Configure JWT authentication strategy
  server.auth.strategy("music_api_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  })

  // Register routes
  server.route([
    ...albumRoutes(albumController),
    ...songRoutes(songController),
    ...userRoutes(userController),
    ...authRoutes(authController),
    ...playlistRoutes(playlistController),
    ...playlistSongRoutes(playlistSongController),
    ...collaborationRoutes(collaborationController),
    ...activityRoutes(activityController),
  ])

  // Register error handler middleware
  server.ext("onPreResponse", errorHandler)

  await server.start()
  console.log(`Server running at ${server.info.uri}`)
}

init()

