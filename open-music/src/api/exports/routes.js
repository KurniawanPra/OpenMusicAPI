const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportsPlaylistHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
]

export default routes

