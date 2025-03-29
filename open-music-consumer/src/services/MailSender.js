import nodemailer from "nodemailer"
import config from "../utils/config.js"

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    })
  }

  async sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic <no-reply@openmusic.com>",
      to: targetEmail,
      subject: "Export Playlist",
      text: "Attached is the result of your playlist export",
      attachments: [
        {
          filename: "playlist.json",
          content,
        },
      ],
    }

    return this._transporter.sendMail(message)
  }
}

export default MailSender

