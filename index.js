const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { log: { logFormat }, server: { port } } = require('config')
const { logger, stream } = require('./src/logger')
const { sendMail } = require('./src/service')

const app = express()
app.use(bodyParser.json())
app.use(morgan(logFormat, { stream }))

app.post('/mail', (req, res) => {
  sendMail(req.body)
    .then(info => res.send(info))
    .catch(err => res.status(500).send(err))
})

app.get('/health', (req, res) => {
  res.send('ok')
})

app.use((req, res) => {
  res.status(404).send('Page not found')
})

app.listen(port, () => {
  logger.info(`Server listening on port: ${port}`)
})
