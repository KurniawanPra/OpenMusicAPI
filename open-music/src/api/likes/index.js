import LikesHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "likes",
  version: "1.0.0",
  register: (server, { likesService, albumsService, cacheService }) => {
    const likesHandler = new LikesHandler(likesService, albumsService, cacheService)
    server.route(routes(likesHandler))
  },
}

