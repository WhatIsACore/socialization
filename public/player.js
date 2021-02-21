'use strict';

const nameTagStyle = {
  fontFamily: 'Roboto Mono',
  fontSize: 14,
  fill: 0xffffff,
  align: 'center',
  dropShadow: true,
  dropShadowBlur: 5,
  dropShadowDistance: 0
}

const Player = function(id, name, position, scale) {
  this.id = id;
  this.name = name;
  this.position = position;
  this.sprite = new Sprite(texture('chars/koala.png'));
  this.sprite.scale.set(scale);
  this.sprite.anchor.set(0.5, 1);
  this.nameTag = new Text(name, nameTagStyle);
  this.nameTag.anchor.set(0.5);
}

// calculate current position from movements
Player.prototype.getPosition = function() {
  if (!this.position.origin) return this.position.target;

  const distance = dist(this.position.origin, this.position.target);
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
