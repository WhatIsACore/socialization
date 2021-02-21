'use strict';

const Game = function(stage) {
  this.socket = io();
  this.stage = stage;
  this.players = {};

  this.mapScale = 2;
  this.mapSprite = new Sprite(texture('bg/mainFloor.png'));
  this.mapSprite.scale.set(this.mapScale);
  this.mapSprite.anchor.set(0.5);
  this.mapSprite.position.set(WIDTH / 2, HEIGHT / 2);
  this.mapSprite.interactive = true;
  this.mapSprite.on('click', this.walkTo.bind(this));
  stage.addChild(this.mapSprite);

  this.offsetX = this.mapSprite.x - (this.mapSprite.width / this.mapScale);
  this.offsetY = this.mapSprite.y - (this.mapSprite.height / this.mapScale);

  this.socket.on('roomdata', this.loadMap.bind(this));
  this.socket.on('addPlayer', this.addPlayer.bind(this));
  this.socket.on('removePlayer', this.removePlayer.bind(this));
  this.socket.on('updatePosition', this.updatePosition.bind(this));
  this.socket.on('exitFound', this.exitFound.bind(this));
}

Game.prototype.update = function() {
  for (let i in this.players) {
    let p = this.players[i];
    let position = p.getPosition();
    p.sprite.position.set(position.x * this.mapScale + this.offsetX, position.y * this.mapScale + this.offsetY);
    p.nameTag.position.set(position.x * this.mapScale + this.offsetX, position.y * this.mapScale + this.offsetY + 10);
  }

  if (this.exit && this.self)
    if (dist(this.self.getPosition(), this.exit) < 15) {
      this.socket.emit('joinRoom', this.exit.destination, this.exit.entrance);
      delete this.exit;
    }
}

Game.prototype.loadMap = function(data, selfId) {
  this.roomId = data.roomId;
  this.map = data.roomMap;
  this.mapScale = data.mapScale;
  this.mapSprite.texture = texture(`bg/${this.map}.png`);
  this.mapSprite.scale.set(this.mapScale);
  this.offsetX = this.mapSprite.x - (this.mapSprite.width / 2);
  this.offsetY = this.mapSprite.y - (this.mapSprite.height / 2);

  // clear previous players
  for (let i in this.players)
    this.removePlayer(i);

  // repopulate players
  for (let i in data.roomState.players)
    this.addPlayer(data.roomState.players[i]);

  // find yourself
  this.self = this.players[selfId];
}

Game.prototype.addPlayer = function(data) {
  let player = new Player(data.id, data.name, data.position, this.mapScale);
  this.players[data.id] = player;
  this.stage.addChild(player.sprite);
  this.stage.addChild(player.nameTag);
}

Game.prototype.removePlayer = function(id) {
  if (!this.players[id]) return;
  this.stage.removeChild(this.players[id].sprite);
  this.stage.removeChild(this.players[id].nameTag);
  delete this.players[id];
}

Game.prototype.walkTo = function(e) {
  delete this.exit;
  let position = {
    x: Math.round((e.data.global.x - this.offsetX) / this.mapScale),
    y: Math.round((e.data.global.y - this.offsetY) / this.mapScale)
  }
  this.socket.emit('walkTo', position);
}

// update a player's position
Game.prototype.updatePosition = function(data) {
  if (!this.players[data.id]) return;
  this.players[data.id].position = data.position;
}

// your destination is an exit
Game.prototype.exitFound = function(exit) {
  this.exit = exit;
}
