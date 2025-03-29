import { config as dotenvConfig } from "dotenv"
dotenvConfig()

const config = {
  app: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 5000,
  },

  auth: {
    accessKey: process.env.ACCESS_TOKEN_KEY || "access-secret-key",
    refreshKey: process.env.REFRESH_TOKEN_KEY || "refresh-secret-key",
    tokenAge: process.env.ACCESS_TOKEN_AGE || 3600,
  },

  database: {
    name: process.env.PGDATABASE || "openmusic",
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
  },

  rabbitMq: {
    server: process.env.RABBITMQ_SERVER || "amqp://localhost",
  },

  redis: {
    host: process.env.REDIS_SERVER || "localhost",
  },
}

export default config

