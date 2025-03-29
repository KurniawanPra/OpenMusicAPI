import ActivitiesHandler from "./handler.js"
import routes from "./routes.js"

export default {
  name: "activities",
  version: "1.0.0",
  register: (server, { activitiesService, playlistsService }) => {
    const activitiesHandler = new ActivitiesHandler(activitiesService, playlistsService)
    server.route(routes(activitiesHandler))
  },
}

