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

		setTimeout(() => {
			$("#modal1").modal("open");

			if (this.Human.chips < 50) {
				$("#betInput").attr("min", this.Human.chips);
			}
		}, 500);
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
		//Make list of aces
		let aceList = [];
		hand.forEach(card => {
			if (card.description === "Ace") {
				aceList.push(card);
			}
		});
		//Convert 1 ace
		aceList[0].points = 1;

		//If score still over 21, convert all aces
		if (this.getHandScore(hand) > 21) {
			for (const card of aceList) {
				card.points = 1;
			}
		}
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
		<img class="cardImage fade-in" src=${
			this.imageDict[card.toShortDisplayString()]
		}>`;
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

	doubleDown = () => {
		document.querySelector("#double-down").disabled = true;
		let double = this.bet * 2;
		if (double < this.Human.chips) {
			this.bet = double;
		} else {
			this.bet = this.Human.chips;
		}
		$("#betText").text(`Your current bet: ${this.bet}`);
		this.runPlayerTurn();
		this.endPlayerTurn();
	};

	endPlayerTurn = () => {
		this.playersTurn = false;
		document.querySelector("#double-down").disabled = true;

		// this.humanScore = this.getHandScore(this.Human.hand1);
		//Dealer's turn
		this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
		$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
		document.querySelector("#hit").disabled = true;
		document.querySelector("#stand").disabled = true;
		setTimeout(() => this.runDealerTurn(), 1000);
	};

	runPlayerTurn = () => {
		document.querySelector("#double-down").disabled = true;

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

		setTimeout(() => {
			if (this.humanScore === 21 && this.dealerScore !== 21) {
				//Human got a natural
				$("#announce-text").text("You got a natural!");
				$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
				this.displayCard(this.Dealer.hand1[1], this.dealerCardDiv);
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

				$("#announce-text").text("You both got naturals! Play again");
				this.restartGame();
				return;
			}
			document.querySelector("#hit").disabled = false;
			document.querySelector("#stand").disabled = false;
		}, 1000);

		// Check for double down
		if (
			this.humanScore === 9 ||
			this.humanScore === 10 ||
			this.humanScore === 11
		) {
			document.querySelector("#double-down").disabled = false;
		}

		//Double aces, reduce the first to 1 point
		if (this.countAces(this.Human.hand1) === 2) {
			this.Human.hand1[0].points = 1;
			this.getHandScore(this.Human.hand1);
			$(".humanHandScore").text(`Hand Score: ${this.humanScore}`);
		}
		if (this.countAces(this.Dealer.hand1) === 2) {
			this.Dealer.hand1[0].points = 1;
			this.getHandScore(this.Dealer.hand1);
			$(".dealerHandScore").text(`Hand Score: ${this.dealerScore}`);
		}

		//Humans turn

		this.playersTurn = true;
	};
}

$(document).ready(() => {
	const Game = new Blackjack();

	document.querySelector("#hit").disabled = true;
	document.querySelector("#stand").disabled = true;
	document.querySelector("#double-down").disabled = true;

	$("#betForm").on("submit", e => {
		e.preventDefault();
		Game.bet = Number($("#betInput").val());

		if (Game.bet <= Game.Human.chips) {
			$("#betText").text(`Your current bet: ${Game.bet}`);
			$("#modal1").modal("close");
			Game.start();
		} else if (Game.Human.chips <= 0) {
			$("#announce-text").text("You're out of doubloons!");

			return;
		} else {
			$("#announce-text").text("You can't bet that much!");
		}
	});
	$(".modal").modal();

	$("#modal1").modal("open");
	$("#hit").on("click", Game.runPlayerTurn);
	$("#stand").on("click", Game.endPlayerTurn);
	$("#double-down").on("click", Game.doubleDown);
});
