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
  createRoom('restroom', 'restroom');

  io.on('connection', socket => {
    socket.on('setName', name => {
      if (socket.player) return;
      let player = createPlayer(name.length > 0 ? name : 'guest', socket);
      player.joinRoom(rooms['mainFloor'], 'clubEntrance');
    });

    setTimeout(() => {
      if (socket.player) return;
      socket.disconnect();
    }, 15 * 1000); // disconnect if no name is provided within 15 sec

    socket.on('joinRoom', (id, entrance) => {
      if (!socket.player) return;
      socket.player.joinRoom(rooms[id], entrance);
    });
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
