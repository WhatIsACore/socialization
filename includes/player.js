'use strict';

const logger = require('./logger');

let players = {};
const Player = function(id, name, socket) {
  this.id = id;
  this.name = name;
  this.socket = socket;

  this.position = {
    target: {x: 0, y: 0},
    origin: null,
    time: null
  }

  socket.on('disconnect', this.disconnect.bind(this));
  socket.on('walkTo', this.walkTo.bind(this));

  logger.info(`player ID=${id} joined!`);
}
module.exports = Player;

Player.prototype.disconnect = function() {
  logger.info(`player ID=${this.id} disconnected.`);

  if (this.room)
    this.room.removePlayer(this);

  this.socket.disconnect();
  delete players[this.id];
}

// request to move somewhere
Player.prototype.walkTo = function(position) {
  if (!this.room) return;

  this.position.target = position;
  this.room.io.emit('updatePosition', {
    id: this.id,
    position: this.position
  });
}

// calculate current position from movements
Player.prototype.getPosition = function() {
  if (!this.position.origin) return this.position.target;

  // TODO: calculate current position
  return this.position.target;
}

Player.prototype.joinRoom = function(room, entranceId) {
  if (this.room)  // leave current room if applicable
    this.room.removePlayer(this);

  this.room = room;
  room.addPlayer(this);
  this.socket.join(room.id);

  this.position.target = room.map.entrances[entranceId];

  this.socket.emit('roomdata', {
    roomId: room.id,
    roomMap: room.baseMap,
    roomState: room.getState()
  });

  logger.info(`player ID=${this.id} joined room ID=${room.id}`);
}
