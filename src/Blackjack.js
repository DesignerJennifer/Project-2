const createDeck = require("./createDeck"),
	Player = require("./Player");

class Blackjack {
	constructor() {
		this.Human = new Player("human");
		this.Dealer = new Player("dealer");
		this.bet = 0;
		this.Deck = createDeck(); // already shuffled
		this.running = true;
		this.humanCardDiv = document.querySelector(".humanHand");
		this.dealerCardDiv = document.querySelector(".dealerHand");
	}

	restartGame = () => {
		const count = document.querySelector("#chipCount");
		count.textContent = `Chips: ${this.Human.chips}`;
		setTimeout(() => {
			if (this.running) {
				this.start();
			}
		}, 3000);
	};

	getHandScore = hand => {
		// Gets the score of each card
		let score = 0;
		hand.forEach(card => {
			score += card.points;
		});
		return score;
	};
	convertAces = hand => {
		hand.forEach(card => {
			if (card.description === "Ace") {
				card.points = 1;
			}
		});
	};
	getHandStrings = hand => {
		let shortStrings = [];
		hand.forEach(card => {
			shortStrings.push(card.toShortDisplayString());
		});
		return shortStrings;
	};
	displayCard = (card, divToAppend) => {
		// const cardToAdd = document.createElement("div");
		// cardToAdd.setAttribute("class", "card");
		const cardToAdd = `<div class="card">
  <h3 class="card__header-title">${card.toString()}</h3>
  <p class="card__header-meta">${card.toShortDisplayString()}</p>
  </div>`;
		$(divToAppend).append(cardToAdd);
	};
	// dealerTurn = ()=>{

	// }
	countAces = hand => {
		let aceCount = 0;
		hand.forEach(card => {
			if (card.description === "Ace") {
				aceCount++;
			}
		});
		return aceCount;
	};

	start = () => {
		// $(document).ready(function() {

		if (this.Human.chips <= 0) {
			// running = false;
			console.log("You're out of chips!");
			return;
		}

		this.Human.hand1 = [];
		this.Human.hand2 = []; //Only for split pairs
		this.Dealer.hand1 = [];
		this.Deck = createDeck();

		console.log(`You have ${this.Human.chips} chips`);
		// let bet = Number(prompt("How much do you want to bet?"));
		this.bet = 500;
		console.clear();

		// Start the game, deal each player 2 cards

		$(this.humanCardDiv).empty();
		$(this.dealerCardDiv).empty();
		this.Deck.deal(2, [this.Human.hand1, this.Dealer.hand1]);

		this.displayCard(this.Dealer.hand1[0], this.dealerCardDiv);

		// this.Human.hand1.forEach(card => this.displayCard(card, this.humanCardDiv));
		for (const card of this.Human.hand1) {
			this.displayCard(card, this.humanCardDiv);
		}
		// Promise wrapper
		setTimeout(() => {
			this.main();
		}, 50);
		// });
		// this.main();
	};

	main = () => {
		// Check for naturals

		let humanScore = this.getHandScore(this.Human.hand1);
		let humanStrings = this.getHandStrings(this.Human.hand1);
		let dealerScore = this.getHandScore(this.Dealer.hand1);
		let dealerStrings = this.getHandStrings(this.Dealer.hand1);
		console.log(`Player score is ${humanScore}`);
		console.log(`Player cards are ${humanStrings}`);
		console.log(`Dealer score is ${dealerScore}`);
		console.log(`Dealer cards are ${dealerStrings}`);

		if (humanScore === 21 && dealerScore !== 21) {
			console.log("You got a natural!");
			let purse = this.bet * 1.5;
			this.Human.chips += purse;
			this.restartGame();
			return;
		} else if (dealerScore === 21 && humanScore !== 21) {
			console.log("Dealer scored a natural.");
			this.Human.chips -= this.bet;
			this.restartGame();
			return;
		} else if (dealerScore === 21 && humanScore === 21) {
			console.log("Round tied");
			this.restartGame();
			return;
		}

		//Humans turn

		let playerTurn = true;
		// let playerBusted = false;

		while (playerTurn) {
			let hit;
			if (humanScore < 21) {
				hit = confirm("Do you want to hit?");
			}

			if (hit) {
				this.Deck.deal(1, [this.Human.hand1]);
				this.displayCard(
					this.Human.hand1[this.Human.hand1.length - 1],
					this.humanCardDiv
				);
				humanScore = this.getHandScore(this.Human.hand1);
				humanStrings = this.getHandStrings(this.Human.hand1);
				if (humanScore > 21 && this.countAces(this.Human.hand1) > 0) {
					this.convertAces(this.Human.hand1);
					humanScore = this.getHandScore(this.Human.hand1);
				}
				console.log(`Player score is ${humanScore}`);

				console.log(`Player cards are ${humanStrings}`);
			} else {
				playerTurn = false;
			}
		}
		humanScore = this.getHandScore(this.Human.hand1);

		if (humanScore > 21) {
			console.log("You busted!");
			this.Human.chips -= this.bet;
			this.restartGame();

			return;
		}

		console.log(`Player score is ${humanScore}`);

		console.log(`Player cards are ${humanStrings}`);

		console.log("Dealer's turn");

		//Dealer's turn

		this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);

		let dealerTurn = true;
		while (dealerTurn) {
			let hit;
			if (dealerScore <= 16) {
				hit = true;
			}

			if (hit) {
				this.Deck.deal(1, [this.Dealer.hand1]);
				dealerScore = this.getHandScore(this.Dealer.hand1);
				dealerStrings = this.getHandStrings(this.Dealer.hand1);
				if (dealerScore > 21 && this.countAces(this.Dealer.hand1) > 0) {
					this.convertAces(this.Dealer.hand1);
					dealerScore = this.getHandScore(this.Dealer.hand1);
				}
				console.log(`Dealer score is ${dealerScore}`);

				console.log(`Dealer cards are ${dealerStrings}`);
			} else {
				dealerTurn = false;
			}
		}

		//Check both players scores for the winner
		dealerScore = this.getHandScore(this.Dealer.hand1);

		if (humanScore > dealerScore || dealerScore > 21) {
			console.log("You won this round");
			this.Human.chips += this.bet;
			this.restartGame();

			return;
		} else if (humanScore === dealerScore) {
			console.log("Round tied");
			this.restartGame();

			return;
		} else {
			console.log("Dealer won this round");
			this.Human.chips -= this.bet;
			this.restartGame();

			return;
		}
	};
}

const Game = new Blackjack();

$("#startBtn").on("click", () => {
	if (!Game.running) {
		Game.running = true;
	}

	Game.start();
});

$("#stopBtn").on("click", () => {
	Game.running = false;
});
