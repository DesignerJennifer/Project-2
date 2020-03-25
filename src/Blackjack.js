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
		this.setChipCount();
	}
	setChipCount = () => {
		$("#chipCount").text(`${this.Human.chips}`);
	};

	restartGame = () => {
		this.setChipCount();
		$(".announcement").show();
		document.querySelector("#betForm").focus();
		if (this.Human.chips < 50) {
			$("#betInput").attr("min", this.Human.chips);
		}
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
		<img class="cardImage" src=${this.imageDict[card.toShortDisplayString()]}>


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

		this.Human.hand1 = [];
		this.Human.hand2 = []; //Only for split pairs
		this.Dealer.hand1 = [];
		this.Deck = createDeck();

		// Start the game, deal each player 2 cards

		$(this.humanCardDiv).empty();
		$(this.dealerCardDiv).empty();
		this.Deck.deal(2, [this.Human.hand1, this.Dealer.hand1]);

		this.displayCard(this.Dealer.hand1[0], this.dealerCardDiv);

		// this.Human.hand1.forEach(card => this.displayCard(card, this.humanCardDiv));
		for (const card of this.Human.hand1) {
			this.displayCard(card, this.humanCardDiv);
		}
		this.humanScore = this.getHandScore(this.Human.hand1);
		this.humanStrings = this.getHandStrings(this.Human.hand1);
		$(".humanHandScore").text(`Hand Score: ${this.humanScore}`);
		$(".dealerHandScore").text("Hand Score: ");

		// Promise wrapper
		setTimeout(() => {
			this.main();
		}, 100);
	};

	checkForWinner = () => {
		//Check both players scores for the winner
		this.dealerScore = this.getHandScore(this.Dealer.hand1);

		if (this.humanScore > this.dealerScore || this.dealerScore > 21) {
			$("#announce-text").text("Arr you won this round! Bet again?");
			this.Human.chips += this.bet;
			this.restartGame();

			return;
		} else if (this.humanScore === this.dealerScore) {
			$("#announce-text").text("Round tied! Play again");
			this.restartGame();

			return;
		} else {
			$("#announce-text").text("Dealer won this round. Better luck next time.");
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
			$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);

			setTimeout(() => this.runDealerTurn(), 1000);
		} else {
			this.checkForWinner();
		}
	};

	endPlayerTurn = () => {
		this.playersTurn = false;
		// this.humanScore = this.getHandScore(this.Human.hand1);
		//Dealer's turn
		this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
		$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
		document.querySelector("#hit").disabled = true;
		document.querySelector("#stand").disabled = true;
		setTimeout(() => this.runDealerTurn(), 1000);
	};

	runPlayerTurn = () => {
		if (this.playersTurn) {
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
			$(".humanHandScore").text(`Hand Score: ${this.humanScore}`);

			if (this.humanScore > 21) {
				$("#announce-text").text("You busted! Try again.");
				document.querySelector("#hit").disabled = true;
				document.querySelector("#stand").disabled = true;
				this.Human.chips -= this.bet;
				this.playersTurn = false;
				this.restartGame();

				return;
			} else if (this.humanScore === 21) {
				this.endPlayerTurn();
			}
		}
	};

	main = () => {
		// Check for naturals

		this.dealerScore = this.getHandScore(this.Dealer.hand1);
		this.dealerStrings = this.getHandStrings(this.Dealer.hand1);

		if (this.humanScore === 21 && this.dealerScore !== 21) {
			//Human got a natural
			$("#announce-text").text("You got a natural!");
			let purse = this.bet * 1.5;
			this.Human.chips += purse;
			this.restartGame();
			return;
		} else if (this.dealerScore === 21 && this.humanScore !== 21) {
			// Dealer got a natural
			this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
			$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
			$("#announce-text").text("Dealer scored a natural. Try again");
			this.Human.chips -= this.bet;
			this.restartGame();
			return;
		} else if (this.dealerScore === 21 && this.humanScore === 21) {
			//Both got naturals
			$(".humanHandScore").text(`Hand Score: ${this.humanScore}`);
			$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
			this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);

			$("#announce-text").text("Round tied. Play again");
			this.restartGame();
			return;
		}

		//Humans turn

		this.playersTurn = true;
		document.querySelector("#hit").disabled = false;
		document.querySelector("#stand").disabled = false;
	};
}

const Game = new Blackjack();

document.querySelector("#hit").disabled = true;
document.querySelector("#stand").disabled = true;

$("#betForm").on("submit", e => {
	e.preventDefault();
	Game.bet = Number($("#betInput").val());

	if (Game.bet <= Game.Human.chips) {
		$("#betText").text(`Your current bet: ${Game.bet}`);
		$(".announcement").hide();
		Game.start();
	} else if (Game.Human.chips <= 0) {
		$("#announce-text").text("You're out of chips!");

		return;
	} else {
		$("#announce-text").text("You can't bet that much!");
	}
});

// $("#saveScore").on("click", () => {
// 	Game.running = false;
// });

$("#hit").on("click", Game.runPlayerTurn);
$("#stand").on("click", Game.endPlayerTurn);
