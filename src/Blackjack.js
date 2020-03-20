const createDeck = require("./createDeck"),
  Player = require("./Player");

const Human = new Player("human");
const Dealer = new Player("dealer");

let Deck = createDeck(); //already shuffled

Deck.deal(2, [Human.hand, Dealer.hand]);
// addPoints(playerHand);
console.log(Human);

// deck.cards.forEach(card =>
//   console.log(card.toShortDisplayString().toLowerCase())
// );
// player1.forEach(card => {
//   console.log(card.toShortDisplayString());
// });
