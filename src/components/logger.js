const { createLogger, format, transports } = require('winston');
const moment = require('moment');
const packageJson = require('../../package.json');

const { combine, timestamp, label, printf, colorize } = format;

const defaultFormat = printf(({ level, message, label, timestamp }) => {
  return `[${label}] <${level}> ${moment(Date.now()).format('DD-MM-YY hh:mm:ss')} | ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'Foreseer Server' }),
    timestamp(() => moment().format('DD-MM-YY hh:mm:ss')),
    defaultFormat,
    colorize(),
  ),
  transports: [
    new transports.Console({ level: 'debug' }), // warnings and errors
    new transports.File({
      filename: `${packageJson.name}_combined.log`,
      level: 'debug'
    }),
    new transports.File({
      filename: `${packageJson.name}_error.log`,
      level: 'error'
    })
  ],
});


logger.add(new transports.Console({
  format: format.simple(),
  level: 'error'
}));

module.exports = logger;
