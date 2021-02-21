'use strict';

function dist(a, b) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return Math.sqrt(dx * dx + dy * dy);
}
module.exports.dist = dist;
