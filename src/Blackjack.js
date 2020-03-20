const createDeck = require("./createDeck"),
  Player = require("./Player");

const Human = new Player("human");
const Dealer = new Player("dealer");

let Deck = createDeck(); // already shuffled

const getHandScore = hand => {
  // Gets the score of each card
  let score = 0;
  hand.forEach(card => {
    score += card.points;
  });
  return score;
};

const getHandStrings = hand => {
  let shortStrings = [];
  hand.forEach(card => {
    shortStrings.push(card.toShortDisplayString());
  });
  return shortStrings;
};

const countAces = hand => {
  let aceCount = 0;
  hand.forEach(card => {
    if (card.description === "Ace") {
      aceCount++;
    }
  });
  return aceCount;
};

// Start the game, deal each player 2 cards
Deck.deal(2, [Human.hand, Dealer.hand]);

console.log(`Player score is ${getHandScore(Human.hand)}`);

console.log(`Player cards are ${getHandStrings(Human.hand)}`);
// console.log(getHandScore(Dealer.hand), getHandStrings(Dealer.hand));
console.log(countAces(Human.hand));
//Humans turn
let humanStrings = getHandStrings(Human.hand);
let humanScore = getHandScore(Human.hand);
let hit;

// if (humanScore < 21) {
//   hit = confirm("Do you want to hit?");
// }
// if (hit) {
//   Deck.deal(1, [Human.hand]);
// }
// console.log(Human.hand);
// console.log("Player has " + getHandScore(Human.hand));
