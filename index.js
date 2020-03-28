const dotenv = require('dotenv').config()
const logger = require('./src/components/logger');

logger.info('Initiating service...')

const server = require('./src/server')
