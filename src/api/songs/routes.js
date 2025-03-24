const routes = (handler) => [
  {
    method: 'POST',
    path: '/',
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => handler.getSongsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/{id}',
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/{id}',
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/{id}',
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  },
];

module.exports = routes;