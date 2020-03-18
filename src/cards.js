const Shuffle = require("shuffle"),
  createDeck = require("./createDeck");
// deck.reset();

let playerHand = [];
let dealerHand = [];

let Deck = createDeck();

Deck.deal(2, [playerHand, dealerHand]);
// addPoints(playerHand);
console.log(playerHand);

// deck.cards.forEach(card =>
//   console.log(card.toShortDisplayString().toLowerCase())
// );
// player1.forEach(card => {
//   console.log(card.toShortDisplayString());
// });
