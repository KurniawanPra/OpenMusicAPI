const AlbumsHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service, validator, service2 }) => {
    const albumsHandler = new AlbumsHandler(service, validator, service2)
    server.route(routes(albumsHandler))
  },
}

