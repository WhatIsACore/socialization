'use strict';

// pretend we have jquery
function $(query){
  var q = document.querySelectorAll(query);
  return q.length > 1 ? q : q[0];
}

let Sprite = PIXI.Sprite;
let Text = PIXI.Text;
const loader = PIXI.Loader.shared;
function texture(path) {
  return loader.resources['/assets/' + path].texture;
}
function sound(path) {
  return loader.resources['/assets/' + path].sound;
}

function dist(a, b) {
  let dx = Math.abs(a.x - b.x);
  let dy = Math.abs(a.y - b.y);
  return Math.sqrt(dx * dx + dy * dy);
}
