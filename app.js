const Shuffle = require("shuffle");
const deck = Shuffle.shuffle();
deck.reset();
let player1 = [];
let player2 = [];

// deck.deal(2, [player1, player2]);

// console.log(player1);

deck.cards.forEach(card =>
  console.log(card.toShortDisplayString().toLowerCase())
);
// player1.forEach(card => {
//   console.log(card.toShortDisplayString());
// });
