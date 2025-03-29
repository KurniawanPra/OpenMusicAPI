import dotenv from "dotenv"
dotenv.config()

const config = {
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER || "amqp://localhost",
  },
  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
  database: {
    host: process.env.PGHOST || "localhost",
    port: process.env.PGPORT || 5432,
    name: process.env.PGDATABASE || "openmusic",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
  },
}

export default config

