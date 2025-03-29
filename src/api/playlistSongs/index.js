const PlaylistSongsHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "playlistSongs",
  version: "1.0.0",
  register: async (
    server,
    { service, validator, playlistsService, songsService, usersService, collabsService, activitiesService },
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service,
      validator,
      playlistsService,
      songsService,
      usersService,
      collabsService,
      activitiesService,
    )
    server.route(routes(playlistSongsHandler))
  },
}

