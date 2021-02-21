'use strict';

const logger = require('./logger');
const Player = require('./player'),
      Room = require('./room');

let io;
let players = {},
    rooms = {};

function init(server) {
  io = require('socket.io')(server);

  // create the rooms we need
  createRoom('mainFloor', 'mainFloor');

  io.on('connection', socket => {
    let player = createPlayer('guest', socket);
    player.joinRoom(rooms['mainFloor'], 'clubEntrance');
  });
}
module.exports.init = init;

function createPlayer(name, socket) {
  let id;
  do {
    id = Math.floor(Math.random() * 100000);
  } while (id in players);

  const p = new Player(id, name, socket);
  players[id] = p;
  socket.player = p;

  return p;
}

function createRoom(id, baseMap) {
  const r = new Room(id, io, baseMap);
  rooms[id] = r;

  return r;
}
