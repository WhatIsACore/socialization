'use strict';

const Player = function(id, name, position) {
  this.id = id;
  this.name = name;
  this.position = position;
  this.sprite = new Sprite(texture('chars/koala.png'));
  this.sprite.scale.set(2);
  this.sprite.anchor.set(0.5, 1);
}

// calculate current position from movements
Player.prototype.getPosition = function() {
  if (!this.position.origin) return this.position.target;

  // TODO: calculate current position
  return this.position.target;
}
