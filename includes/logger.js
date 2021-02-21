'use strict';

const winston = require('winston');
const logger = winston.createLogger();

// console output
logger.add(new winston.transports.Console({
  format: winston.format.simple()
}));

module.exports = logger;
