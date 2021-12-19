"use strict";
const deck = document.querySelector(".deck");
const revealedCards = document.querySelector(".revealedCard");
let deckOfCards = [
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "10H",
  "JH",
  "QH",
  "KH",
  "AH",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "10D",
  "JD",
  "QD",
  "KD",
  "AD",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "10C",
  "JC",
  "QC",
  "KC",
  "AC",
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "10S",
  "JS",
  "QS",
  "KS",
  "AS",
];

let deckArray = [];
let revealedCardsArray = [];
while (deckOfCards.length > 0) {
  let randomCard = deckOfCards[Math.floor(Math.random() * deckOfCards.length)];
  deckArray.push(randomCard);
  deckOfCards.splice(deckOfCards.indexOf(randomCard), 1);
  console.log(randomCard);
}
deck.addEventListener("click", () => {
  let revealedCard = deckArray.pop();
  if (revealedCard) {
    revealedCardsArray.push(revealedCard);
    revealedCards.innerHTML = `<img src="cards/${revealedCard}.png" />`;
  } else {
    deckArray = revealedCardsArray.reverse().slice();
    revealedCardsArray = [];
  }
});
