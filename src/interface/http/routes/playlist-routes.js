const playlistRoutes = (controller) => [
  {
    method: "POST",
    path: "/playlists",
    handler: (request, h) => controller.createPlaylist(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: (request, h) => controller.getPlaylists(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: (request, h) => controller.deletePlaylist(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
]

export default playlistRoutes

