const albumRoutes = (controller) => [
  {
    method: "POST",
    path: "/albums",
    handler: (request, h) => controller.createAlbum(request, h),
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: (request, h) => controller.getAlbumById(request, h),
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: (request, h) => controller.updateAlbum(request, h),
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: (request, h) => controller.deleteAlbum(request, h),
  },
]

export default albumRoutes

