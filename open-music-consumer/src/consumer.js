import amqp from "amqplib"
import PlaylistsService from "./services/PlaylistsService.js"
import MailSender from "./services/MailSender.js"
import config from "./utils/config.js"
import pool from "./config/database.js"

const init = async () => {
  const playlistsService = new PlaylistsService(pool)
  const mailSender = new MailSender()

  const connection = await amqp.connect(config.rabbitMq.server)
  const channel = await connection.createChannel()
  const queueName = "export:playlist"

  await channel.assertQueue(queueName, {
    durable: true,
  })

  channel.consume(queueName, async (message) => {
    try {
      const content = JSON.parse(message.content.toString())
      const { playlistId, targetEmail, userId } = content

      console.log(`[INFO] Received message: ${message.content.toString()}`)

      const playlist = await playlistsService.getPlaylistById(playlistId)
      const songs = await playlistsService.getSongsFromPlaylist(playlistId)

      const playlistData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: songs,
        },
      }

      const result = await mailSender.sendEmail(targetEmail, JSON.stringify(playlistData))

      console.log(`[INFO] Email sent: ${result}`)

      channel.ack(message)
    } catch (error) {
      console.error(`[ERROR] ${error.message}`)
      channel.ack(message)
    }
  })

  console.log(`[INFO] Consumer service is running`)
}

init()

