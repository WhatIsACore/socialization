'use strict';

let Sprite = PIXI.Sprite;
const loader = PIXI.Loader.shared;
function texture(path) {
  return loader.resources['/assets/' + path].texture;
}
