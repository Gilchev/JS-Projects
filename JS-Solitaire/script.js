"use strict";
// Declare identifiers
const deck = document.querySelector(".deck");
const deckImage = document.querySelector("#deck-image");
const revealedCards = document.querySelector(".revealed-card");
const gameField = document.querySelector(".body");
const selectionImage = document.querySelector("#selection");
const revealedCardsImage = document.querySelector("#revealed-image");
const cardColumns = document.querySelectorAll(".column");
const targets = document.querySelectorAll(".target");
document.addEventListener("contextmenu", (event) => event.preventDefault());
// Playing card class to create every card as object
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
// Initial values
let counter;
let secondsPassed = 0;
let initialDeckArray = [];
let deckArray = [];
let revealedCardsArray = [];
let revealedCard, selectedCard;
let columnsArray = [[], [], [], [], [], [], []];
let targetsArray = [[], [], [], []];
// For each suite combine with each power and create a playing card
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
// Starting with rightmost column, take cards randomly from inital deck and add them(the last is flipped)
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
// Leftover cards are pushed randomly into the deck array
function setDeck() {
  while (initialDeckArray.length > 0) {
    let randomCard =
      initialDeckArray[Math.floor(Math.random() * initialDeckArray.length)];
    randomCard.origin = "";
    deckArray.push(randomCard);
    initialDeckArray.splice(initialDeckArray.indexOf(randomCard), 1);
  }
}
// On right click on any revealed card in a column, check if its valid to be put into the target pile, and do it if true
function rightClickCard(card) {
  let columnIndex = String(card.parentElement.classList).split(" ").pop();
  let cardIndex = columnsArray[columnIndex].length - 1;
  let clickedCard = columnsArray[columnIndex][cardIndex];
  for (let i = 0; i < targetsArray.length; i++) {
    if (targetsArray[i].length === 0 && clickedCard.value === 1) {
      targetsArray[i].push(columnsArray[columnIndex].pop());
      updateColumn(columnIndex);
      updateTarget(i);
      return;
    } else {
      let topCard = targetsArray[i][targetsArray[i].length - 1];
      if (
        clickedCard.suite === topCard.suite &&
        clickedCard.value === topCard.value + 1
      ) {
        targetsArray[i].push(columnsArray[columnIndex].pop());
        updateColumn(columnIndex);
        updateTarget(i);
        return;
      }
    }
  }
}
// Draws either card back or card image to cardColumns[i] element with overlap styling. Top-most cards have "interactable" class and columnClick function added. Top-most and face-up cards also have rightClickCard function added to them aswell.
function drawCard(i, j) {
  columnsArray[i][j].origin = `column ${i}`;
  let colSize = columnsArray[i].length;
  if (columnsArray[i][j].isFlipped) {
    cardColumns[
      i
    ].innerHTML += `<img class ="interactable"onclick="columnClick(this)" oncontextmenu="rightClickCard(this)" style="grid-column: 1; grid-row: ${
      j + 1
    } / span 2;" src="${columnsArray[i][j].image}"/>`;
  } else {
    if (j === colSize - 1) {
      cardColumns[
        i
      ].innerHTML += `<img class="interactable"onclick="columnClick(this)" style="grid-column: 1; grid-row: ${
        j + 1
      } / span 2;" src="miscimages/cardback.png"/>`;
    } else {
      cardColumns[i].innerHTML += `<img style="grid-column: 1; grid-row: ${
        j + 1
      } / span 2;" src="miscimages/cardback.png"/>`;
    }
  }
}
// Goes through each column and for each element in that column, call drawCard function
function renderColumns() {
  for (let i = 6; i >= 0; i--) {
    for (let j = 0; j < columnsArray[i].length; j++) {
      drawCard(i, j);
    }
  }
}
// From total seconds passed, calculate and format into "mm:ss" and update .timer class' innerText with the value
function updateTimerDisplay() {
  let min = Math.floor(secondsPassed / 60);
  min <= 9 ? (min = `0${min}`) : null;
  let sec = secondsPassed % 60;
  sec >= 60 ? (sec = 0) : null;
  sec <= 9 ? (sec = `0${sec}`) : null;
  document.querySelector(".timer").innerText = `${min}:${sec}`;
}
// Adds 1 to secondsPassed, calls updateTimerDisplay, and call self after 1 second
function startTimer() {
  secondsPassed++;
  updateTimerDisplay();
  counter = setTimeout("startTimer()", 1000);
}

// Initialization function
function init() {
  createDeck();
  dealColumns();
  setDeck();
  renderColumns();
  startTimer();
}
// Call init function on load
init();
// Checks if all "targets" have 13 elements in them, if true show victory-screen and overlay divs and snapshot final time, score and total moves
function checkForVictory() {
  if (
    targetsArray[0][12] &&
    targetsArray[1][12] &&
    targetsArray[2][12] &&
    targetsArray[3][12]
  ) {
    document.querySelector(".victory-screen").classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
    document.querySelector("#final-time").innerText =
      document.querySelector(".timer").innerText;
  }
}

// Sets selectionImage elements source as the selected card's and hides cursor
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
// Clears selected card, selection image and restores cursor
function dropCard() {
  selectedCard = null;
  selectionImage.innerHTML = "";
  document.body.style.cursor = "default";
}
// Wipes a column clean and renders it anew, updating corresponding array's cards origin attribute(if its empty, adds empty image with emptyColumnClick function)
function updateColumn(i) {
  cardColumns[i].innerHTML = "";
  if (columnsArray[i].length === 0) {
    cardColumns[
      i
    ].innerHTML = `<img style="border: solid white;border-radius: 5px;
    " onclick="emptyColumnClick(this)" src="miscimages/empty.png" />`;
    return;
  }
  for (let j = 0; j < columnsArray[i].length; j++) {
    columnsArray[i][j].origin = `column ${i}`;
    drawCard(i, j);
  }
}
//Updates selected target's image to either the last element in corresponding array or empty image
function updateTarget(target) {
  if (targetsArray[target].length > 0) {
    targets[target].src = `${
      targetsArray[target][targetsArray[target].length - 1].image
    }`;
  } else {
    targets[target].src = `miscimages/empty.png`;
  }
}

// Flip-over function that is called when clicked on a face-down interactable card
function flip(columnIndex) {
  columnsArray[columnIndex][
    columnsArray[columnIndex].length - 1
  ].isFlipped = true;
  updateColumn(columnIndex);
}
// If there is a picked-up card, check if its valid to be put on top of target and do if it is. If there isn't, pick up top-most card in target pile(if not empty)
function targetClick(target) {
  let targetIndex = String(target.classList).split(" ").pop();
  let array = targetsArray[targetIndex];
  if (selectedCard) {
    if (array.length === 0 && selectedCard.value === 1) {
      selectedCard.origin = `target ${targetIndex}`;
      array.push(selectedCard);
      dropCard();
    } else if (
      array.length >= 1 &&
      array[array.length - 1].suite === selectedCard.suite &&
      array[array.length - 1].value === selectedCard.value - 1
    ) {
      selectedCard.origin = `target ${targetIndex}`;
      array.push(selectedCard);
      dropCard();
    }
  } else if (array.length > 0 && !selectedCard) {
    selectedCard = array.pop();
    pickUpCard();
  }
  updateTarget(targetIndex);
  checkForVictory();
}
// Function only present on empty image in columns, which checks if there is a selected card/s and if so, checks if the card(or leading card if there are multiple cards being dragged) is a King. If it is, place whole selection on the empty spot
function emptyColumnClick(card) {
  let columnIndex = String(card.parentElement.classList).split(" ").pop();
  if (!selectedCard) return;
  if (!Array.isArray(selectedCard)) {
    if (
      selectedCard.value === 13 ||
      selectedCard.origin === `column ${columnIndex}`
    ) {
      columnsArray[columnIndex].push(selectedCard);
      dropCard();
      updateColumn(columnIndex);
    }
  } else {
    if (
      selectedCard[0].value === 13 ||
      selectedCard[0].origin === `column ${columnIndex}`
    ) {
      columnsArray[columnIndex] =
        columnsArray[columnIndex].concat(selectedCard);
      dropCard();
      updateColumn(columnIndex);
    }
  }
}
// Helper function to columnClick, called when there is no selected card. Flips top-most card of a column if its face-down, or picks up the selected face-up card(and any following cards if it isnt the top-most one).
function pickUpFromColumn(card, index) {
  let cardImageName = String(card.src).split("/");
  const l = cardImageName.length;
  cardImageName = `${cardImageName[l - 2]}/${cardImageName[l - 1]}`;
  if (cardImageName === "miscimages/cardback.png") {
    flip(index);
  } else {
    let cardIndex = columnsArray[index]
      .map((e) => e.image)
      .indexOf(cardImageName);
    if (cardIndex === columnsArray[index].length - 1) {
      selectedCard = columnsArray[index].pop();
      pickUpCard();
    } else {
      selectedCard = columnsArray[index].splice(
        cardIndex,
        columnsArray[index].length - cardIndex
      );
    }
    pickUpCard();
    updateColumn(index);
  }
}
// If there is no selected card, calls pickUpFromColumn. Otherwise, checks if selected card is a single one or multiple(in which case it takes the leading card's value and color), and places it on selected column if valid. Also places it if the card(s)'s origin is the selected column.
function columnClick(card) {
  let columnIndex = String(card.parentElement.classList).split(" ").pop();
  if (!selectedCard) {
    pickUpFromColumn(card, columnIndex);
  } else {
    let targetCard =
      columnsArray[columnIndex][columnsArray[columnIndex].length - 1];
    if (!Array.isArray(selectedCard)) {
      if (
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
// Shows the top-most card in revealedCardsArray on revealedCardsImage, or shoes nothing if array is empty
function updateRevealedCards() {
  if (revealedCardsArray.length >= 1) {
    revealedCardsImage.classList.add("interactable");
    revealedCardsImage.src = `${
      revealedCardsArray[revealedCardsArray.length - 1].image
    }`;
  } else {
    revealedCardsImage.classList.remove("interactable");
    revealedCardsImage.src = `miscimages/empty.png`;
  }
}
// Eventlistener on whole document to have selectionImage follow the cursor
document.addEventListener("mousemove", (e) => {
  let x = e.clientX;
  let y = e.clientY;
  selectionImage.style.left = `${x}px`;
  selectionImage.style.top = `${y}px`;
});

// On-click function to flip through the deck, and flip it over if there are no more cards left
deck.addEventListener("click", () => {
  if (!selectedCard) {
    revealedCard = deckArray.pop();
    deckArray.length === 0 ? (deckImage.src = "miscimages/refresh.png") : null;
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
// Picks up the top-most card, or sets it back(if its origin is from there)
revealedCards.addEventListener("click", () => {
  if (!selectedCard) {
    if (revealedCardsArray.length === 0) return;
    selectedCard = revealedCardsArray.pop();
    pickUpCard();
  } else if (selectedCard && selectedCard.origin === "revealedCards") {
    revealedCardsArray.push(selectedCard);
    dropCard();
  }
  updateRevealedCards();
});
// On right click, check if top-most card in revealedCardsArray is valid to be put on one of the target piles, and do so if true.
revealedCards.addEventListener("contextmenu", (e) => {
  if (revealedCardsArray.length > 0) {
    let clickedCard = revealedCardsArray[revealedCardsArray.length - 1];
    for (let i = 0; i < targetsArray.length; i++) {
      if (targetsArray[i].length === 0 && clickedCard.value === 1) {
        targetsArray[i].push(revealedCardsArray.pop());
        updateRevealedCards();
        updateTarget(i);
        return;
      } else {
        let topCard = targetsArray[i][targetsArray[i].length - 1];
        if (
          clickedCard.suite === topCard.suite &&
          clickedCard.value === topCard.value + 1
        ) {
          targetsArray[i].push(revealedCardsArray.pop());
          updateRevealedCards();
          updateTarget(i);
          return;
        }
      }
    }
  }
});
