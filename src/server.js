process.title = 'Foreseer Server'

const express = require('express')
const socket = require('socket.io');
const cors = require('cors')
const logger = require('./components/logger')
const app = express()

const port = process.env.SERVER_PORT || 80

const server = app.listen(port, () => {
  app.use(express.json());
  app.use(cors())
  logger.info(`Listening on port: ${port}`)
  app.use('/', require('./routes'))
})

module.exports = socket(server)
