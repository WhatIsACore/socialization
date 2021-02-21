'use strict';

module.exports = {
  scale: 4,
  entrances: {
    mainFloor: {x: 10, y: 70}
  },
  exits: [
    {
      x: 10, y: 70,
      destination: 'mainFloor',
      entrance: 'restroom'
    }
  ]
}
