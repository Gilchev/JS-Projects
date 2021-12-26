"use strict";
//#1 Declare identifiers
const deck = document.querySelector(".deck");
const deckImage = document.querySelector("#deck-image");
const revealedCards = document.querySelector(".revealed-card");
const gameField = document.querySelector(".body");
const selectionImage = document.querySelector("#selection");
const revealedCardsImage = document.querySelector("#revealed-image");
const cardColumns = document.querySelectorAll(".column");
const targets = document.querySelectorAll(".target");
//#2 Playing card class to create every card as object
class PlayingCard {
  constructor(power, suite) {
    this.power = power;
    this.suite = suite;
    this.origin;
    this.isFlipped = true;
  }
  get value() {
    if (this.power >= 2 && this.power <= 10) {
      return Number(this.power);
    } else {
      switch (this.power) {
        case "A":
          return 1;
        case "J":
          return 11;
        case "Q":
          return 12;
        case "K":
          return 13;
      }
    }
  }
  get cardName() {
    return `${this.power + this.suite}`;
  }
  get image() {
    return `cards/${this.power + this.suite}.png`;
  }
  get color() {
    if (this.suite === "H" || this.suite === "D") {
      return "red";
    } else {
      return "black";
    }
  }
}
//#3 Initial values for card pile, revealed cards, columns etc.
let initialDeckArray = [];
let deckArray = [];
let revealedCardsArray = [];
let revealedCard, selectedCard;
let columnsArray = [[], [], [], [], [], [], []];
let targetsArray = [[], [], [], []];
//#4 For each suite combine with each power and create a playing card
let suites = ["H", "C", "S", "D"];
function createDeck() {
  let powers = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  suites.forEach((suite) => {
    powers.forEach((power) => {
      new PlayingCard(power, suite);
      initialDeckArray.push(new PlayingCard(power, suite));
    });
  });
}
//#5 Starting with rightmost column, take cards randomly from inital deck and add them(the last is flippet)
function dealColumns() {
  for (let i = 6; i >= 0; i--) {
    for (let j = i; j >= 0; j--) {
      let randomCard =
        initialDeckArray[Math.floor(Math.random() * initialDeckArray.length)];
      randomCard.origin = `column ${i}`;
      randomCard["isFlipped"] = j === 0 ? true : false;
      columnsArray[i].push(randomCard);
      initialDeckArray.splice(initialDeckArray.indexOf(randomCard), 1);
    }
  }
}
//#6 Leftover cards are pushed randomly into the deck array
function setDeck() {
  while (initialDeckArray.length > 0) {
    let randomCard =
      initialDeckArray[Math.floor(Math.random() * initialDeckArray.length)];
    randomCard.origin = "";
    deckArray.push(randomCard);
    initialDeckArray.splice(initialDeckArray.indexOf(randomCard), 1);
  }
}
//#7 Go through each element in columsArray and add either card back or card image to cardColumns element with overlap stylig and columnClick function
function renderColumns() {
  for (let i = 6; i >= 0; i--) {
    for (let j = 0; j < columnsArray[i].length; j++) {
      if (columnsArray[i][j].isFlipped) {
        cardColumns[
          i
        ].innerHTML += `<img onclick="columnClick(this)" style="grid-column: 1; grid-row: ${
          j + 1
        } / span 2;" src="${columnsArray[i][j].image}"/>`;
      } else {
        cardColumns[
          i
        ].innerHTML += `<img onclick="columnClick(this)" style="grid-column: 1; grid-row: ${
          j + 1
        } / span 2;" src="miscimages/cardback.png"/>`;
      }
    }
  }
}
//#8 initialization function
function init() {
  createDeck();
  dealColumns();
  setDeck();
  renderColumns();
}

init();
//#9 sets selectionImage elements source as the selected card's and hides cursor
function pickUpCard() {
  if (!Array.isArray(selectedCard)) {
    selectionImage.innerHTML = `<img class="selection-image" src="${selectedCard.image}"/>`;
    document.body.style.cursor = "none";
  } else {
    let selectionLength = selectedCard.length;
    for (let i = 0; i < selectionLength; i++) {
      selectionImage.innerHTML += `<img class="selection-image"style="grid-column: 1; grid-row: ${
        i + 1
      } / span 2;" src="${selectedCard[i].image}"/>`;
    }
  }
}
//#10 clears selected card, selection image and restores cursor
function dropCard() {
  selectedCard = null;
  selectionImage.innerHTML = "";
  document.body.style.cursor = "default";
}
//#11 wipes a column clean and renders it anew with proper styling and functions
function updateColumn(i) {
  cardColumns[i].innerHTML = "";
  if (columnsArray[i].length === 0) {
    cardColumns[
      i
    ].innerHTML = `<img onclick="columnClick(this)" src="miscimages/empty.png" />`;
  }
  for (let j = 0; j < columnsArray[i].length; j++) {
    columnsArray[i][j].origin = `column ${i}`;
    if (columnsArray[i][j].isFlipped) {
      cardColumns[
        i
      ].innerHTML += `<img onclick="columnClick(this)" style="grid-column: 1; grid-row: ${
        j + 1
      } / span 2;" src="${columnsArray[i][j].image}"/>`;
    } else {
      cardColumns[
        i
      ].innerHTML += `<img onclick="columnClick(this)" style="grid-column: 1; grid-row: ${
        j + 1
      } / span 2;" src="miscimages/cardback.png"/>`;
    }
  }
}

function updateTarget(d) {
  targets[d].src = `${selectedCard.image}`;
}

//#12 Flip-over function that is called when clicked on a down facing card
function flip(columnIndex) {
  columnsArray[columnIndex][
    columnsArray[columnIndex].length - 1
  ].isFlipped = true;
  updateColumn(columnIndex);
}

function targetClick(d) {
  if (selectedCard) {
    let targetIndex = String(d.classList).split(" ").pop();
    if (targetsArray[targetIndex].length === 0 && selectedCard.value === 1) {
      targetsArray[targetIndex].push(selectedCard);
      updateTarget(targetIndex);
      dropCard();
    } else if (
      targetsArray[targetIndex].length >= 1 &&
      targetsArray[targetIndex][targetsArray[targetIndex].length - 1].suite ===
        selectedCard.suite &&
      targetsArray[targetIndex][targetsArray[targetIndex].length - 1].value ===
        selectedCard.value - 1
    ) {
      targetsArray[targetIndex].push(selectedCard);
      updateTarget(targetIndex);
      dropCard();
    }
  }
  if (
    targetsArray[0][12] &&
    targetsArray[1][12] &&
    targetsArray[2][12] &&
    targetsArray[3][12]
  ) {
    alert("kecnq");
  }
}

function columnClick(d) {
  let columnIndex = String(d.parentElement.classList).split(" ").pop();
  if (!selectedCard) {
    let cardImageName = String(d.src).split("/");
    const l = cardImageName.length;
    cardImageName = `${cardImageName[l - 2]}/${cardImageName[l - 1]}`;
    if (cardImageName === "miscimages/cardback.png") {
      flip(columnIndex);
    } else {
      let cardIndex = columnsArray[columnIndex]
        .map((e) => e.image)
        .indexOf(cardImageName);
      if (cardIndex === columnsArray[columnIndex].length - 1) {
        selectedCard = columnsArray[columnIndex].pop();
        pickUpCard();
      } else {
        selectedCard = columnsArray[columnIndex].splice(
          cardIndex,
          columnsArray[columnIndex].length - cardIndex
        );
      }
      pickUpCard();
      updateColumn(columnIndex);
    }
  } else {
    let targetCard =
      columnsArray[columnIndex][columnsArray[columnIndex].length - 1];
    if (!Array.isArray(selectedCard)) {
      if (columnsArray[columnIndex].length === 0 && selectedCard.value === 13) {
        columnsArray[columnIndex].push(selectedCard);
        dropCard();
        updateColumn(columnIndex);
      } else if (
        (selectedCard.color !== targetCard.color &&
          selectedCard.value === targetCard.value - 1) ||
        selectedCard.origin === targetCard.origin
      ) {
        columnsArray[columnIndex].push(selectedCard);
        dropCard();
        updateColumn(columnIndex);
      }
    } else {
      if (
        columnsArray[columnIndex].length === 0 &&
        selectedCard[0].value === 13
      ) {
        columnsArray[columnIndex] =
          columnsArray[columnIndex].concat(selectedCard);
        dropCard();
        updateColumn(columnIndex);
      } else if (
        (selectedCard[0].color !== targetCard.color &&
          selectedCard[0].value === targetCard.value - 1) ||
        selectedCard[0].origin === targetCard.origin
      ) {
        columnsArray[columnIndex] =
          columnsArray[columnIndex].concat(selectedCard);
        dropCard();
        updateColumn(columnIndex);
      }
    }
  }
}
//#13 Shows the top-most card in revealedCardsArray on revealedCardsImage, or shoes nothing if array is empty
function updateRevealedCards() {
  if (revealedCardsArray.length >= 1) {
    revealedCardsImage.src = `${
      revealedCardsArray[revealedCardsArray.length - 1].image
    }`;
  } else {
    revealedCardsImage.src = ``;
  }
}
//#14 eventlistener on whole document to have selectionImage follow the cursor
document.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  selectionImage.style.left = `${x}px`;
  selectionImage.style.top = `${y}px`;
});

//#15 on-click function to flip through the deck, and flip it over if there are no more cards left
deck.addEventListener("click", () => {
  if (!selectedCard) {
    revealedCard = deckArray.pop();
    deckArray.length === 0 ? (deckImage.src = "") : null;
    if (revealedCard) {
      revealedCard.origin = "revealedCards";
      revealedCardsArray.push(revealedCard);
      updateRevealedCards();
    } else {
      deckArray = revealedCardsArray.reverse().slice();
      revealedCardsArray = [];
      revealedCardsImage.src = "";
      deckImage.src = `miscimages/cardback.png`;
    }
  }
});
//#16 Picks up the top-most card, or sets it back(if its origin is from there)
revealedCards.addEventListener("click", () => {
  if (!selectedCard) {
    if (revealedCardsArray.length === 0) return;
    selectedCard = revealedCardsArray.pop();
    updateRevealedCards();
    pickUpCard();
  } else if (selectedCard && selectedCard.origin === "revealedCards") {
    revealedCardsArray.push(selectedCard);
    updateRevealedCards();
    dropCard();
  }
});
