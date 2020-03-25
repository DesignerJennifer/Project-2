const createDeck = require("./createDeck"),
	Player = require("./Player"),
	imageDict = require("./imageDictionary");

class Blackjack {
	constructor() {
		this.Human = new Player("human");
		this.Dealer = new Player("dealer");
		this.bet = 0;
		this.Deck = createDeck(); // already shuffled
		this.running = false;
		this.humanCardDiv = document.querySelector(".humanHand");
		this.dealerCardDiv = document.querySelector(".dealerHand");
		this.humanScore = 0;
		this.humanStrings;
		this.dealerScore = 0;
		this.dealerStrings;
		this.imageDict = imageDict;
		this.playersTurn = false;
	}

	restartGame = () => {
		const count = document.querySelector("#chipCount");
		count.textContent = `${this.Human.chips}`;
		setTimeout(() => {
			if (this.running) {
				this.start();
			}
		}, 5000);
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
		const cardToAdd = `
		<img src=${this.imageDict[card.toShortDisplayString()]}>


  `;
		$(divToAppend).append(cardToAdd);
	};

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
		this.running = true;

		if (this.Human.chips <= 0) {
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
	};

	checkForWinner = () => {
		//Check both players scores for the winner
		this.dealerScore = this.getHandScore(this.Dealer.hand1);

		if (this.humanScore > this.dealerScore || this.dealerScore > 21) {
			console.log("You won this round");
			this.Human.chips += this.bet;
			this.restartGame();

			return;
		} else if (this.humanScore === this.dealerScore) {
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

	runDealerTurn = () => {
		let hit;
		if (this.dealerScore <= 16) {
			hit = true;
		}

		if (hit) {
			this.Deck.deal(1, [this.Dealer.hand1]);
			this.displayCard(
				this.Dealer.hand1[this.Dealer.hand1.length - 1],
				this.dealerCardDiv
			);
			this.dealerScore = this.getHandScore(this.Dealer.hand1);
			this.dealerStrings = this.getHandStrings(this.Dealer.hand1);
			if (this.dealerScore > 21 && this.countAces(this.Dealer.hand1) > 0) {
				this.convertAces(this.Dealer.hand1);
				this.dealerScore = this.getHandScore(this.Dealer.hand1);
			}
			setTimeout(() => this.runDealerTurn(), 1000);
		} else {
			this.checkForWinner();
		}
	};

	runPlayerTurn = () => {
		let hit;
		if (this.humanScore < 21) {
			hit = confirm("Do you want to hit?");
		}

		if (hit) {
			this.Deck.deal(1, [this.Human.hand1]);
			this.displayCard(
				this.Human.hand1[this.Human.hand1.length - 1],
				this.humanCardDiv
			);
			this.humanScore = this.getHandScore(this.Human.hand1);
			this.humanStrings = this.getHandStrings(this.Human.hand1);

			if (this.humanScore > 21 && this.countAces(this.Human.hand1) > 0) {
				this.convertAces(this.Human.hand1);
				this.humanScore = this.getHandScore(this.Human.hand1);
			}
			setTimeout(() => this.runPlayerTurn(), 50);
		} else {
			this.humanScore = this.getHandScore(this.Human.hand1);

			if (this.humanScore > 21) {
				console.log("You busted!");
				this.Human.chips -= this.bet;
				this.restartGame();

				return;
			}
			//Dealer's turn
			this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
			setTimeout(() => this.runDealerTurn(), 1000);
		}
	};

	main = () => {
		// Check for naturals

		this.humanScore = this.getHandScore(this.Human.hand1);
		this.humanStrings = this.getHandStrings(this.Human.hand1);
		this.dealerScore = this.getHandScore(this.Dealer.hand1);
		this.dealerStrings = this.getHandStrings(this.Dealer.hand1);

		if (this.humanScore === 21 && this.dealerScore !== 21) {
			console.log("You got a natural!");
			let purse = this.bet * 1.5;
			this.Human.chips += purse;
			this.restartGame();
			return;
		} else if (this.dealerScore === 21 && this.humanScore !== 21) {
			this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
			console.log("Dealer scored a natural.");
			this.Human.chips -= this.bet;
			this.restartGame();
			return;
		} else if (this.dealerScore === 21 && this.humanScore === 21) {
			console.log("Round tied");
			this.restartGame();
			return;
		}

		//Humans turn

		this.runPlayerTurn();
	};
}

const Game = new Blackjack();

document.querySelector("#hit").disabled = true;
document.querySelector("#stand").disabled = true;

$("#startBtn").on("click", () => {
	if (!Game.running) {
		Game.start();
	}
});

$("#stopBtn").on("click", () => {
	Game.running = false;
});
