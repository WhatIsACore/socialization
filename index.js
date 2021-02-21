'use strict';

require('dotenv').config();
const logger = require('./includes/logger'),
      game = require('./includes/game');

const express = require('express'),
      routes = express(),
      server = require('http').Server(routes);

routes.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/game.html');
      })
      .use('/', express.static(__dirname + '/public'));

server.listen(process.env.PORT, () => {
  logger.info('starting webserver on port ' + process.env.PORT);
});

game.init(server);
