import routes from "./routes.js"
import AuthenticationHandler from "./handler.js"

export default {
  name: "authentications",
  version: "1.0.0",
  register: async (server, { service, tokenManager, validator }) => {
    const authenticationsHandler = new AuthenticationHandler(service, tokenManager, validator)
    server.route(routes(authenticationsHandler))
  },
}

