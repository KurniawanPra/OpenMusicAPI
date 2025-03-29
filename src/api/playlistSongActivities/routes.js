const routes = (handler) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: (request, h) => handler.getPlaylistSongActivitiesHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
]

module.exports = routes

