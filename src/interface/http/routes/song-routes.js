const songRoutes = (controller) => [
  {
    method: "POST",
    path: "/songs",
    handler: (request, h) => controller.createSong(request, h),
  },
  {
    method: "GET",
    path: "/songs",
    handler: (request, h) => controller.getSongs(request, h),
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: (request, h) => controller.getSongById(request, h),
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: (request, h) => controller.updateSong(request, h),
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: (request, h) => controller.deleteSong(request, h),
  },
]

export default songRoutes

