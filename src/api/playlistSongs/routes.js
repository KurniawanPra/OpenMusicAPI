const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.postPlaylistSongHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.getPlaylistSongsHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.deletePlaylistSongHandler(request, h),
    options: {
      auth: "open_music_jwt",
    },
  },
]

module.exports = routes

