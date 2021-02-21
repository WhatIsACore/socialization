'use strict';

module.exports = {
  scale: 2,
  entrances: {
    clubEntrance: {x: 70, y: 155},
    restroom: {x: 372, y: 155}
  },
  exits: [
    {
      x: 372, y: 145,
      destination: 'restroom',
      entrance: 'mainFloor'
    }
  ]
}
