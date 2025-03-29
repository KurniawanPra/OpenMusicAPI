const collaborationRoutes = (controller) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: (request, h) => controller.addCollaboration(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: (request, h) => controller.removeCollaboration(request, h),
    options: {
      auth: "music_api_jwt",
    },
  },
]

export default collaborationRoutes

