import PlaylistSongsHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "playlistsongs",
  version: "1.0.0",
  register: (server, { playlistsService, playlistSongsService, activitiesService, cacheService, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistsService,
      playlistSongsService,
      activitiesService,
      cacheService,
      validator,
    )

    server.route(routes(playlistSongsHandler))
  },
}

