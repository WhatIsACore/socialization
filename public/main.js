'use strict';

let WIDTH = 1200;
let HEIGHT = 750;

function Main() {
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer({
    width: WIDTH,
    height: HEIGHT,
    view: document.getElementById('game')
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  this.loadSprites();
}

const resourceList = [
  'bg/mainFloor.png',
  'chars/koala.png'
];

Main.prototype.loadSprites = function() {
  let resources = resourceList;
  for (let i = 0; i < resources.length; i++)
    resources[i] = '/assets/' + resources[i];
  loader.add(resourceList)
      .load(this.init.bind(this));
}

Main.prototype.init = function() {
  this.game = new Game(this.stage);
  setInterval(this.draw.bind(this), 1000 / 60);
}

Main.prototype.draw = function() {
  this.game.update();
  this.renderer.render(this.stage);
}
