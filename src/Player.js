const uuid = require("uuid");

class Player {
  constructor(descrip = "player", chips = 1000) {
    this.id = uuid.v4();
    this.description = descrip;
    this.hand = [];
    this.chips = chips;
  }
}

module.exports = Player;
