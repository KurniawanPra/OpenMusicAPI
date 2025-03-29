const userRoutes = (controller) => [
  {
    method: "POST",
    path: "/users",
    handler: (request, h) => controller.createUser(request, h),
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: (request, h) => controller.getUserById(request, h),
  },
  {
    method: "GET",
    path: "/users",
    handler: (request, h) => controller.getUsersByUsername(request, h),
  },
]

export default userRoutes

