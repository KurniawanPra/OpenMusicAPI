import pg from "pg"
import config from "../utils/config.js"

const pool = new pg.Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
})

export default pool

