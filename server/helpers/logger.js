// const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const config = require('../environments');

console.log("config.BASE_DIR_PATH >>" + config.BASE_DIR_PATH);
console.log("config.BASE_PATH >> " + config.BASE_PATH)

const transport = new transports.DailyRotateFile({
    'name': 'access-file',
    'level': 'info',
    'filename': './logs/access.log',
    'json': true,
    'datePattern': 'yyyy-MM-DD',
    'prepend': true
});

const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [transport]
});

module.exports = {
    'logger': logger
};