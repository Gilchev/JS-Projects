"use strict";
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
const deck = document.querySelector(".deck");
const revealedCards = document.querySelector(".revealedCard");
const gameField = document.querySelector(".body");
const selectedCardImage = document.getElementById("cursor");

let deckArray = [];
let revealedCardsArray = [];
let revealedCard;
let selectedCard = {
  origin,
  cardName: "",
  exists: false,
};

while (deckOfCards.length > 0) {
  let randomCard = deckOfCards[Math.floor(Math.random() * deckOfCards.length)];
  deckArray.push(randomCard);
  deckOfCards.splice(deckOfCards.indexOf(randomCard), 1);
}

function updateRevealedCards() {
  revealedCards.innerHTML = `<img src="cards/${
    revealedCardsArray[revealedCardsArray.length - 1]
  }.png" />`;
}

document.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  selectedCardImage.style.left = `${x}px`;
  selectedCardImage.style.top = `${y}px`;
});

//on-click function to flip through the deck, and flip it over if there are no more cards left
deck.addEventListener("click", () => {
  if (!selectedCard.cardName) {
    revealedCard = deckArray.pop();
    deckArray.length === 0 ? (deck.innerHTML = "") : null;
    if (revealedCard) {
      revealedCardsArray.push(revealedCard);
      updateRevealedCards();
    } else {
      deckArray = revealedCardsArray.reverse().slice();
      revealedCardsArray = [];
      revealedCards.innerHTML = "";
      deck.innerHTML = `<img src="miscimages/cardback.png" alt="" />`;
    }
  }
});

revealedCards.addEventListener("click", () => {
  if (!selectedCard.cardName) {
    if (revealedCardsArray.length === 0) return;
    selectedCard.origin = "revealedCards";
    selectedCard.cardName = revealedCardsArray.pop();
    updateRevealedCards();
    selectedCardImage.innerHTML = `<img src="cards/${selectedCard.cardName}.png" />`;
    document.body.style.cursor = "none";
  } else if (selectedCard.cardName && selectedCard.origin === "revealedCards") {
    selectedCard.origin = "";
    revealedCardsArray.push(selectedCard.cardName);
    selectedCard.cardName = "";
    updateRevealedCards();
    selectedCardImage.innerHTML = ``;
    document.body.style.cursor = "default";
  }
});
