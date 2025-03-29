const authRoutes = (controller) => [
  {
    method: "POST",
    path: "/authentications",
    handler: (request, h) => controller.login(request, h),
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: (request, h) => controller.refreshToken(request, h),
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: (request, h) => controller.logout(request, h),
  },
]

export default authRoutes

