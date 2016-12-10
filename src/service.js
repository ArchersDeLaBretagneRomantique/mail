const path = require('path')
const fs = require('fs')
const { createTransport } = require('nodemailer')
const { compile } = require('handlebars')
const { mail } = require('config')

const transporter = createTransport(Object.assign({}, mail))

const mails = {
  VALIDATION: {
    subject: '[Archers de la Bretagne Romantique] Valider mon adresse',
    templatePath: path.join(__dirname, '../html/validation.html'),
  },
}

function read(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, file) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(file)
    })
  })
}

function send(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject({ status: 500, reason: err })
      else resolve(info)
    })
  })
}

function sendMail({ to, type, context }) {
  const { subject, templatePath } = mails[type]

  const mailOptions = {
    to,
    from: '"Les Archers de la Bretagne Romantique" <no-reply@archersdelabretagneromantique.bzh>',
    subject,
  }

  return read(templatePath)
    .then(template => compile(template)(context))
    .then(html => send(Object.assign({}, mailOptions, { html })))
}

module.exports = {
  sendMail,
}
