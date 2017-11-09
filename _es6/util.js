
export function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export function flipCoin() {
	return random(0, 1);
}

export function randomElement(array) {
	return array[random(0, array.length)];
}