const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const modifierButtons = document.querySelectorAll('[data-modifier]');
const equalsButton = document.querySelector('[data-equals]')
const previousOperandTextElement = document.querySelector(`[data-previous-operand]`);
const OperationTextElement = document.querySelector(`[data-operation]`);
const currentOperandTextElement = document.querySelector(`[data-current-operand]`);
const historyTextElement = document.querySelector(`[data-history-content]`);
const bodyElement = document.querySelector(`[data-body]`)

let calculatorHistory = [];
//add current calculation to history, deleting 1st element if it gets too big
function updateHistory(n1, op, n2, ans){
    if(calculatorHistory.length > 24) calculatorHistory.shift();
    calculatorHistory.push(`${n1} ${op} ${n2} = ${ans}`)
    historyTextElement.innerText = calculatorHistory.join("\n")
    return;
}
//on a number button press
function numberButtonPress(buttonPressed, operand){
    if(buttonPressed === "."){ //if its . add a leading 0, or do nothing if number already has one
        if(operand.includes(".")) return operand;
        if(!operand) return "0.";
    }
    if(buttonPressed === "0" && operand.length >= 1) return operand; //remove repeating 0s at start (so number cant be 00002)
    return operand += buttonPressed; //append the digit otherwise
}
//calculate depending on operator and add operation to history
function calculate(numOne, operator, numTwo){
    !numOne ? numOne = 0 : null;
    let answer = "";
    if(!numTwo) return numOne;
    switch(operator){
        case "-": answer = numOne - numTwo; break;
        case "+": answer = +numOne + +numTwo; break;
        case "X": answer = numOne * numTwo; break;
        case "*": answer = numOne * numTwo; break;
        case "÷": answer = numOne / numTwo; break;
        case "/": answer = numOne / numTwo; break;
        default: break;
    }
    updateHistory(numOne,operator,numTwo,answer);
    return answer;
}
//removes digits from 2nd number(removes from 1st if 2nd is empty)
function deleteDigit(){
    if(!currentOperandTextElement.innerText){
        let deleter = previousOperandTextElement.innerText.split("");
        deleter.pop();
        previousOperandTextElement.innerText = deleter.join("");
    } else {
        let deleter = currentOperandTextElement.innerText.split("");
        deleter.pop();
        currentOperandTextElement.innerText = deleter.join("");
    }
    return;
}
//clears 2nd number(if 2nd is empty clears 1st and operator)
function allClear(){
    if(!currentOperandTextElement.innerText){
        previousOperandTextElement.innerText = "";
        OperationTextElement.innerText = "";
    } else {
        currentOperandTextElement.innerText = "";
    }
}
//reverse sign of 2nd number(or 1st if 2nd is empty)
function reverseSign(){
    if(!currentOperandTextElement.innerText){
        previousOperandTextElement.innerText *= -1;
    } else {
        currentOperandTextElement.innerText *= -1;
    }
}
//multiply 2nd number by 0.01(or 1st if 2nd is empty)
function percentify(){
    if(!currentOperandTextElement.innerText){
        previousOperandTextElement.innerText *= 0.01;
    } else {
        currentOperandTextElement.innerText *= 0.01
    }
}
//calls numberButtonPress on 2nd number(or 1st number if no operation is selected yet)
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if(!OperationTextElement.innerText){
            previousOperandTextElement.innerText = numberButtonPress(button.innerText, previousOperandTextElement.innerText);
        } else {
            currentOperandTextElement.innerText = numberButtonPress(button.innerText, currentOperandTextElement.innerText);
        }
    })
  })
//switches operator or calculates current numbers with current operator and then switches to selected operator
operationButtons.forEach(button =>{
    button.addEventListener("click", () =>{
        if(currentOperandTextElement.innerText.length > 0){
            previousOperandTextElement.innerText = calculate(previousOperandTextElement.innerText, OperationTextElement.innerText, currentOperandTextElement.innerText);
            OperationTextElement.innerText = button.innerText
            currentOperandTextElement.innerText = "";
        } else {
            OperationTextElement.innerText = button.innerText
        }
    })
})
//calculates current numbers, setting 1st number as result and clearing operation and 2nd number
equalsButton.addEventListener("click", () =>{
    previousOperandTextElement.innerText = calculate(previousOperandTextElement.innerText, OperationTextElement.innerText, currentOperandTextElement.innerText);
    OperationTextElement.innerText = ""
    currentOperandTextElement.innerText = "";
    
})
//add modifier functions to corresponding button
modifierButtons.forEach(button =>{
    button.addEventListener("click", () =>{
        switch(button.innerText){
            case "←": deleteDigit(); break;
            case "AC": allClear(); break;
            case "+/-": reverseSign(); break;
            case "%": percentify(); break;
        }
    })
})
//add event listener to body that calls corresponding function on keyboard keys
bodyElement.addEventListener("keydown", (e) =>{
    let keyPressed = e.key
    if((keyPressed >= 0 && keyPressed <= 9) || keyPressed === "."){
        if(!OperationTextElement.innerText){
            previousOperandTextElement.innerText = numberButtonPress(keyPressed, previousOperandTextElement.innerText);
        } else {
            currentOperandTextElement.innerText = numberButtonPress(keyPressed, currentOperandTextElement.innerText);
        }
    } else if("/*-+".includes(keyPressed)){
        if(currentOperandTextElement.innerText.length > 0){
            previousOperandTextElement.innerText = calculate(previousOperandTextElement.innerText, OperationTextElement.innerText, currentOperandTextElement.innerText);
            OperationTextElement.innerText = keyPressed
            currentOperandTextElement.innerText = "";
        } else {
            OperationTextElement.innerText = keyPressed;
        }
    } else if(keyPressed === "Enter"){
        previousOperandTextElement.innerText = calculate(previousOperandTextElement.innerText, OperationTextElement.innerText, currentOperandTextElement.innerText);
        OperationTextElement.innerText = ""
        currentOperandTextElement.innerText = "";
    } else if(keyPressed === "Backspace") deleteDigit();
})
