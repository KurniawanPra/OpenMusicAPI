import amqp from "amqplib"
import config from "../utils/config.js"
import { Buffer } from "node:buffer"

class ProducerService {
  async sendMessage(queue, message) {
    const connection = await amqp.connect(config.rabbitMq.server)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, {
      durable: true,
    })

    await channel.sendToQueue(queue, Buffer.from(message))

    setTimeout(() => {
      connection.close()
    }, 1000)
  }
}

export default ProducerService

