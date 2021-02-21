'use strict';

const logger = require('./logger'),
      util = require('./utility');

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

  this.position.origin = this.getPosition();
  this.position.target = position;
  this.position.time = Date.now();

  const exit = this.room.findExit(position);
  if (exit)
    this.socket.emit('exitFound', exit);

  this.room.io.emit('updatePosition', {
    id: this.id,
    position: this.position
  });
}

// calculate current position from details of last walk instruction
Player.prototype.getPosition = function() {
  if (!this.position.origin) return this.position.target;

  const distance = util.dist(this.position.origin, this.position.target);
  const elapsed = Date.now() - this.position.time;
  const travelDuration = distance * 8;
  if (elapsed > travelDuration) return this.position.target;

  const completionFactor = elapsed / travelDuration;
  const dx = completionFactor * (this.position.target.x - this.position.origin.x);
  const dy = completionFactor * (this.position.target.y - this.position.origin.y);
  return {
    x: Math.round(this.position.origin.x + dx),
    y: Math.round(this.position.origin.y + dy)
  };
}

Player.prototype.joinRoom = function(room, entranceId) {
  if (!room) return;

  if (this.room)  // leave current room if applicable
    this.room.removePlayer(this);

  this.room = room;
  this.position.target = room.map.entrances[entranceId];
  this.position.origin = null;
  this.position.time = null;

  room.addPlayer(this);
  this.socket.join(room.id);
  this.socket.emit('roomdata', {
    roomId: room.id,
    roomMap: room.baseMap,
    mapScale: room.map.scale,
    roomState: room.getState()
  }, this.id);

  logger.info(`player ID=${this.id} joined room ID=${room.id}`);
}
