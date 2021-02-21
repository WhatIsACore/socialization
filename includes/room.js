'use strict';

const logger = require('./logger'),
      maps = require('./maps');

const Room = function(id, io, baseMap) {
  this.id = id;
  this.io = io.to(id);
  this.baseMap = baseMap;
  this.map = maps.get(baseMap);
  this.players = {};
  this.population = 0;
}
module.exports = Room;

Room.prototype.addPlayer = function(player) {
  this.io.emit('addPlayer', {
    id: player.id,
    name: player.name,
    position: player.position
  });
  this.players[player.id] = player;
  this.population++;
}

Room.prototype.removePlayer = function(player) {
  this.io.emit('removePlayer', player.id);
  delete this.players[player.id];
  this.population--;
}

Room.prototype.getState = function() {
  let res = {
    players: {}
  };
  for (let i in this.players) {
    const player = this.players[i];
    res.players[i] = {
      id: player.id,
      name: player.name,
      position: player.position
    };
  }
  return res;
}
