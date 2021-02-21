'use strict';

let WIDTH = 1200;
let HEIGHT = 750;

let main;
$('#submit-btn').addEventListener('click', () => {
  $('#nameBox').style.display = 'none';
  main = new Main();
});

function Main() {
  this.stage = new PIXI.Container();
  this.renderer = PIXI.autoDetectRenderer({
    width: WIDTH,
    height: HEIGHT,
    view: $('#game')
  });
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  this.loadSprites();
}

const resourceList = [
  'bg/mainFloor.png',
  'bg/restroom.png',
  'chars/koala.png',
  'audio/moneymachine.mp3'
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
  requestAnimationFrame(this.draw.bind(this));
}

Main.prototype.draw = function() {
  this.game.update();
  this.renderer.render(this.stage);
  requestAnimationFrame(this.draw.bind(this));
}
