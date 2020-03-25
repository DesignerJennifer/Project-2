const Shuffle = require("shuffle");

const createDeck = () => {
	const addPoints = cards =>
	//calculates how much points each card is worth
		cards.forEach(card => {
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
				card.points = 11;

				break;
			default:
				card.points = card.sort;
			}
		});

	let deck = Shuffle.shuffle();
	addPoints(deck.cards);

	return deck;
};

module.exports = createDeck;
