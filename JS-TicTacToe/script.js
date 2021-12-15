const tickBoxElements = document.querySelectorAll("[data-tickBox]");
const boxOne = document.getElementById("b1");
const boxTwo = document.getElementById("b2");
const boxThree = document.getElementById("b3");
const boxFour = document.getElementById("b4");
const boxFive = document.getElementById("b5");
const boxSix = document.getElementById("b6");
const boxSeven = document.getElementById("b7");
const boxEight = document.getElementById("b8");
const boxNine = document.getElementById("b9");
const scoreBoard = document.querySelector("[data-currentScore]")
const currentPlayerIndicator = document.querySelector("[data-currentPlayer]");

currentPlayerIndicator.innerHTML = `Current player \n<span style="font-family:cursive;color:blue;">O</span>`
scoreBoard.innerHTML = `<span style="font-family:cursive;color:red;">X</span>   0 : 0  <span style="font-family:cursive;color:blue;">O</span>`

let currentPlayer = true; // true = O : false = X
let score = {
    "O" : 0,
    "X" : 0
}

function comparison(a, b, c){
    return (a.innerText === b.innerText && a.innerText === c.innerText && a.innerText)
}

function checkForWinner(){ 
    if(comparison(boxOne,boxTwo,boxThree))  return boxOne.innerText
    if(comparison(boxFour,boxFive,boxSix))  return boxFour.innerText;
    if(comparison(boxSeven,boxEight,boxNine)) return boxSeven.innerText;
    if(comparison(boxOne,boxFour,boxSeven)) return boxOne.innerText;
    if(comparison(boxTwo,boxFive,boxEight)) return boxTwo.innerText;
    if(comparison(boxThree,boxSix,boxNine)) return boxThree.innerText;
    if(comparison(boxOne,boxFive,boxNine)) return boxOne.innerText;
    if(comparison(boxThree,boxFive,boxSeven)) return boxThree.innerText;
}

function wipeGameBoard(){
    tickBoxElements.forEach(element =>{
        element.innerText = "";
    })
}

tickBoxElements.forEach(element => {
        element.addEventListener("click", () =>{
            if(!element.innerText){
                element.innerText = currentPlayer ? "O" : "X";
                element.style.color = currentPlayer ? "blue" : "red"
                currentPlayerIndicator.innerHTML = currentPlayer ? `Current player \n<span style="font-family:cursive;color:red;">X</span>` : `Current player \n<span style="font-family:cursive;color:blue;">O</span>`
                currentPlayer = !currentPlayer;
                if(checkForWinner()){
                    score[checkForWinner()] ++;
                    scoreBoard.innerHTML = `<span style="font-family:cursive;color:red;">X</span>   ${score["X"]} : ${score["O"]}  <span style="font-family:cursive;color:blue;">O</span>`
                    wipeGameBoard();
                }
            }
        })
});

