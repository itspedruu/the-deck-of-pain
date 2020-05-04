const ADDITIONAL_CARDS = ['J', 'Q', 'K', 'A'];
const CARDS_SUITS = ['H', 'C', 'D', 'S'];
const CARD_NUMBERS = Array(9).fill().map((_, index) => index + 2).concat(ADDITIONAL_CARDS);
const EXERCISES = ['Burpees', 'Sit-Ups', 'Plank', 'Push-ups'];

let history = [];
let animationInterval, nextCardTimeout;

function isShowingResultCard() {
	const backElement = document.querySelector(`.back`);

	return backElement.style.transform == 'perspective(600px) rotateY(-180deg)';
}

function flip() {
	const isReverse = isShowingResultCard();
	const values = isReverse ? [0, -180] : [-180, 0];

	for (let index = 0; index < 2; index++) {
		const element = document.querySelector(`.${index == 0 ? 'back' : 'front'}`);

		element.style.transform = `perspective(600px) rotateY(${values[index]}deg)`;
	}
}

function reset() {
	clearTimeout(animationInterval);
	flip(false);
	hideResult();
}

function animate(requiresTimeout = true) {
	flip();

	if (requiresTimeout) {
		animationInterval = setTimeout(reset, 10000);
	}
}

function pushToHistory(card) {
	history.push(card);

	if (history.length == 52)
		history = [];
}

function selectRandomCard() {
	const cards = Array(52).fill().map((_, index) => {
		const suit = CARDS_SUITS[Math.floor(index / 13)];
		const number = CARD_NUMBERS[index % 13];
		
		return number + suit;
	}).filter(card => !history.includes(card));

	return cards[Math.floor(Math.random() * cards.length)];
}

async function changeCardTo(card) {
	const element = document.querySelector('.front img');
	element.src = `assets/cards/${card}.png`;
}

function getResultAccordingToCard(card) {
	const cardNumber = card.slice(0, -1);
	const cardSuit = card.slice(-1);
	const amount = ['J', 'Q', 'K'].includes(cardNumber)
		? 10
		: cardNumber == 'A'
			? 'Maximum'
			: parseInt(cardNumber);

	const exercise = EXERCISES[CARDS_SUITS.findIndex(suit => suit == cardSuit)];
	const requiresTime = exercise == 'Plank';
	return `${amount} ${requiresTime ? 'minutes of ' : ''}${exercise}`;
}

function displayResult(card) {
	const element = document.querySelector('#exercise-display');

	element.style.display = 'initial';
	element.innerHTML = card ? getResultAccordingToCard(card) : 'Drawing...';
}

function hideResult() {
	const element = document.querySelector('#exercise-display');
	element.style.display = 'none';
}

function drawCard() {
	const card = selectRandomCard();
	const wasShowingResultCard = isShowingResultCard();

	if (wasShowingResultCard)
		reset();

	if (nextCardTimeout)
		clearTimeout(nextCardTimeout);

	displayResult();

	nextCardTimeout = setTimeout(async () => {
		nextCardTimeout = null;

		pushToHistory(card);

		changeCardTo(card);

		displayResult(card);

		animate();
	}, wasShowingResultCard ? 1250 : 0);
}