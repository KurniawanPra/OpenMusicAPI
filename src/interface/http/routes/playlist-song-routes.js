const playlistSongRoutes = (controller) => [
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: (request, h) => controller.addSongToPlaylist(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: (request, h) => controller.getPlaylistSongs(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: (request, h) => controller.removeSongFromPlaylist(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
]

export default playlistSongRoutes

