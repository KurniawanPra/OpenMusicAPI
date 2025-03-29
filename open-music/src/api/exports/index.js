import ExportsHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "exports",
  version: "1.0.0",
  register: (server, { producerService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(producerService, playlistsService, validator)
    server.route(routes(exportsHandler))
  },
}

