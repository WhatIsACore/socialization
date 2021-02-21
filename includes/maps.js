'use strict';

const mapData = {
  mainFloor: require('./maps/mainFloor')
}

// returns map data
function get(id) {
  return mapData[id];
}
module.exports.get = get;
