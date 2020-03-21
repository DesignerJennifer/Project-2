const createDeck = require("./createDeck"),
  Player = require("./Player");

const Human = new Player("human");
const Dealer = new Player("dealer");

const getHandScore = hand => {
  // Gets the score of each card
  let score = 0;
  hand.forEach(card => {
    score += card.points;
  });
  return score;
};
const convertAces = hand => {
  hand.forEach(card => {
    if (card.description === "Ace") {
      card.points = 1;
    }
  });
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

let running = true;
// Get player bet
const main = () => {
  if (Human.chips <= 0) {
    running = false;
    console.log("You're out of chips!");
    return;
  }

  let Deck = createDeck(); // already shuffled
  Human.hand1 = [];
  Human.hand2 = []; //Only for split pairs
  Dealer.hand1 = [];

  console.log(`You have ${Human.chips} chips`);
  let bet = Number(prompt("How much do you want to bet?"));
  console.clear();

  // Start the game, deal each player 2 cards
  Deck.deal(2, [Human.hand1, Dealer.hand1]);

  // Check for naturals

  let humanScore = getHandScore(Human.hand1);
  let humanStrings = getHandStrings(Human.hand1);
  let dealerScore = getHandScore(Dealer.hand1);
  let dealerStrings = getHandStrings(Dealer.hand1);
  console.log(`Player score is ${humanScore}`);

  console.log(`Player cards are ${humanStrings}`);

  console.log(`Dealer score is ${dealerScore}`);

  console.log(`Dealer cards are ${dealerStrings}`);

  if (humanScore === 21 && dealerScore !== 21) {
    console.log("You got a natural!");
    let purse = bet * 1.5;
    Human.chips += purse;
    return;
  } else if (dealerScore === 21 && humanScore !== 21) {
    console.log("Dealer scored a natural.");
    Human.chips -= bet;
    return;
  } else if (dealerScore === 21 && humanScore === 21) {
    console.log("Round tied");
    return;
  }

  //Humans turn

  let playerTurn = true;
  let playerBusted = false;

  while (playerTurn) {
    let hit;
    if (humanScore < 21) {
      hit = confirm("Do you want to hit?");
    }

    if (hit) {
      Deck.deal(1, [Human.hand1]);
      humanScore = getHandScore(Human.hand1);
      humanStrings = getHandStrings(Human.hand1);
      if (humanScore > 21 && countAces(Human.hand1) > 0) {
        convertAces(Human.hand1);
        humanScore = getHandScore(Human.hand1);
      }
      console.log(`Player score is ${humanScore}`);

      console.log(`Player cards are ${humanStrings}`);
    } else {
      playerTurn = false;
    }
  }
  humanScore = getHandScore(Human.hand1);

  if (humanScore > 21) {
    console.log("You busted!");
    Human.chips -= bet;
    return;
  }

  console.log(`Player score is ${humanScore}`);

  console.log(`Player cards are ${humanStrings}`);

  console.log("Dealer's turn");

  //Dealer's turn

  let dealerTurn = true;

  while (dealerTurn) {
    let hit;
    if (dealerScore <= 16) {
      hit = true;
    }

    if (hit) {
      Deck.deal(1, [Dealer.hand1]);
      dealerScore = getHandScore(Dealer.hand1);
      dealerStrings = getHandStrings(Dealer.hand1);
      if (dealerScore > 21 && countAces(Dealer.hand1) > 0) {
        convertAces(Dealer.hand1);
        dealerScore = getHandScore(Dealer.hand1);
      }
      console.log(`Dealer score is ${dealerScore}`);

      console.log(`Dealer cards are ${dealerStrings}`);
    } else {
      dealerTurn = false;
    }
  }

  //Check both players scores for the winner
  dealerScore = getHandScore(Dealer.hand1);

  if (humanScore > dealerScore || dealerScore > 21) {
    console.log("You won this round");
    Human.chips += bet;
    return;
  } else if (humanScore === dealerScore) {
    console.log("Round tied");
    return;
  } else {
    console.log("Dealer won this round");
    Human.chips -= bet;
    return;
  }
};

// 3 rounds for testing

for (let i = 0; i < 3; i++) {
  main();
}
