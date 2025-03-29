import PlaylistsHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "playlists",
  version: "1.0.0",
  register: (server, { playlistsService, cacheService, validator }) => {
    const playlistsHandler = new PlaylistsHandler(playlistsService, cacheService, validator)
    server.route(routes(playlistsHandler))
  },
}

