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

//initial current player indicator and scoreboard
currentPlayerIndicator.innerHTML = `Current player \n<span style="font-family:cursive;color:blue;">O</span>`
scoreBoard.innerHTML = `<span style="font-family:cursive;color:red;">X</span>   0 : 0  <span style="font-family:cursive;color:blue;">O</span>`
//current player boolean to alternate and empty score object
let currentPlayer = true; // true = O : false = X
let score = {
    "O" : 0,
    "X" : 0
}
//helper function that checks if three elements are equal and are not null
function comparison(a, b, c){
    return (a.innerText === b.innerText && a.innerText === c.innerText && a.innerText)
}
//goes through every box element and if there are no empty boxes(emptyBoxes = 0) returns true
function checkForTie(){
    let emptyBoxes = 9;
    tickBoxElements.forEach(element => {
        if(element.innerText) emptyBoxes --;
    })
    return emptyBoxes === 0 ? true : false
}

function checkForWinner(){ 
    //checks for a tie, and if it isnt, compare each set of possible lines and returns one of its contents
    if(checkForTie()) return "tie";
    if(comparison(boxOne,boxTwo,boxThree))  return boxOne.innerText
    if(comparison(boxFour,boxFive,boxSix))  return boxFour.innerText;
    if(comparison(boxSeven,boxEight,boxNine)) return boxSeven.innerText;
    if(comparison(boxOne,boxFour,boxSeven)) return boxOne.innerText;
    if(comparison(boxTwo,boxFive,boxEight)) return boxTwo.innerText;
    if(comparison(boxThree,boxSix,boxNine)) return boxThree.innerText;
    if(comparison(boxOne,boxFive,boxNine)) return boxOne.innerText;
    if(comparison(boxThree,boxFive,boxSeven)) return boxThree.innerText;
}
//goes through each box and clears its content
function wipeGameBoard(){
    tickBoxElements.forEach(element =>{
        element.innerText = "";
    })
}
//adds function on each box that runs only if box is empty
tickBoxElements.forEach(element => {
        element.addEventListener("click", () =>{
            if(!element.innerText){
                element.innerText = currentPlayer ? "O" : "X"; //depending on currentPlayer sets contents to O or X
                element.style.color = currentPlayer ? "blue" : "red" //and colors its font accordingly
                currentPlayerIndicator.innerHTML = currentPlayer ? `Current player <span style="font-family:cursive;color:red;">X</span>` : `Current player \n<span style="font-family:cursive;color:blue;">O</span>`
                currentPlayer = !currentPlayer; //alternates currentPlayer variable
                if(checkForWinner()){ //checks if function returs non-null / non-undefined variable
                    if(checkForWinner !== "tie"){ //if its not a tie adds to winner's score and updates scoreboard
                        score[checkForWinner()] ++;
                        scoreBoard.innerHTML = `<span style="font-family:cursive;color:red;">X</span>   ${score["X"]} : ${score["O"]}  <span style="font-family:cursive;color:blue;">O</span>`
                    }
                    wipeGameBoard(); 

                }
                
            }
        })
});