const winston = require('winston')
const { log: { level } } = require('config')

const logger = new winston.Logger({
  level,
  transports: [
    new winston.transports.Console(),
  ],
})

const stream = {
  write: message => logger.info(message.slice(0, -1)),
}

module.exports = {
  logger,
  stream,
}
