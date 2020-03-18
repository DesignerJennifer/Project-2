const Shuffle = require("shuffle");
const deck = Shuffle.shuffle();
// deck.reset();

let playerHand = [];
let dealerHand = [];

deck.deal(2, [playerHand, dealerHand]);
const addPoints = hand =>
  //calculates how much points each card is worth
  hand.forEach(card => {
    switch (card.sort) {
      case 11:
        // Jack
        card.points = 10;

        break;
      case 12:
        // Queen
        card.points = 10;

        break;
      case 13:
        // King
        card.points = 10;

        break;
      case 14:
        // Ace
        card.points = [1, 11];

        break;
      default:
        card.points = card.sort;
    }
  });
addPoints(playerHand);
console.log(playerHand);

// deck.cards.forEach(card =>
//   console.log(card.toShortDisplayString().toLowerCase())
// );
// player1.forEach(card => {
//   console.log(card.toShortDisplayString());
// });
