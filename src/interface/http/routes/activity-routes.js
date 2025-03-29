const activityRoutes = (controller) => [
  {
    method: "GET",
    path: "/playlists/{id}/activities",
    handler: (request, h) => controller.getPlaylistActivities(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
]

export default activityRoutes

