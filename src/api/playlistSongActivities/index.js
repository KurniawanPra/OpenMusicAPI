const PlaylistSongActivitiesHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "playlistSongActivities",
  version: "1.0.0",
  register: async (server, { service, playlistsService, collabsService, usersService, songsService }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      service,
      playlistsService,
      collabsService,
      usersService,
      songsService,
    )
    server.route(routes(playlistSongActivitiesHandler))
  },
}

