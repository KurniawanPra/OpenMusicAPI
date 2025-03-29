import AlbumsHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "albums",
  version: "1.0.0",
  register: async (server, { albumsService, storageService, cacheService, validator }) => {
    const albumsHandler = new AlbumsHandler(albumsService, storageService, cacheService, validator)
    server.route(routes(albumsHandler))
  },
}

