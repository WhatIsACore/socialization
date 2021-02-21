'use strict';

const Game = function(stage) {
  this.socket = io();
  this.stage = stage;
  this.players = {};

  this.mapSprite = new Sprite(texture('bg/mainFloor.png'));
  this.mapSprite.scale.set(2);
  this.mapSprite.anchor.set(0.5);
  this.mapSprite.position.set(WIDTH / 2, HEIGHT / 2);
  this.mapSprite.interactive = true;
  this.mapSprite.on('click', this.walkTo.bind(this));
  stage.addChild(this.mapSprite);

  this.offsetX = this.mapSprite.x - (this.mapSprite.width / 2);
  this.offsetY = this.mapSprite.y - (this.mapSprite.height / 2);

  this.socket.on('roomdata', this.loadMap.bind(this));
  this.socket.on('addPlayer', this.addPlayer.bind(this));
  this.socket.on('removePlayer', this.removePlayer.bind(this));
  this.socket.on('updatePosition', this.updatePosition.bind(this));
}

Game.prototype.update = function() {
  for (let i in this.players) {
    let p = this.players[i];
    let position = p.getPosition();
    p.sprite.position.set(position.x * 2 + this.offsetX, position.y * 2 + this.offsetY);
  }
}

Game.prototype.loadMap = function(data) {
  this.roomId = data.roomId;
  this.map = data.roomMap;
  this.mapSprite.texture = texture(`bg/${this.map}.png`);

  // clear previous players
  for (let i in this.players) {
    this.stage.removeChild(this.players[i].sprite);
    delete this.players[i];
  }

  // repopulate players
  for (let i in data.roomState.players)
    this.addPlayer(data.roomState.players[i]);
}

Game.prototype.addPlayer = function(data) {
  let player = new Player(data.id, data.name, data.position);
  this.players[data.id] = player;
  this.stage.addChild(player.sprite);
}

Game.prototype.removePlayer = function(id) {
  if (!this.players[id]) return;
  this.stage.removeChild(this.players[id].sprite);
  delete this.players[id];
}

Game.prototype.walkTo = function(e) {
  let position = {
    x: (e.data.global.x - this.offsetX) / 2,
    y: (e.data.global.y - this.offsetY) / 2
  }
  this.socket.emit('walkTo', position);
}

// update a player's position
Game.prototype.updatePosition = function(data) {
  if (!this.players[data.id]) return;
  this.players[data.id].position = data.position;
}
