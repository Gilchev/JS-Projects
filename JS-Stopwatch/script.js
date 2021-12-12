const displayTextElement = document.querySelector("[data-display]");
const resetButton = document.querySelector("[data-resetButton]");
const startButton = document.querySelector("[data-startButton]");
const lapButton = document.querySelector("[data-lapButton]");
const stopButton = document.querySelector("[data-stopButton]");
const lapHistoryTextElement = document.querySelector("[data-lapHistory]");


stopButton.style.display = "none";
lapButton.style.display = "none";
let lapCount = 0;
let lapHistory = {};
let centiseconds = "00";
let seconds = "00";
let minutes = "00";
let counter;

function clearHistory(){
    lapCount = 0;
    lapHistoryTextElement.innerText = ``;
    for (const key of Object.keys(lapHistory)) {
        delete lapHistory[key];
    }
    return;
}

function updateDisplay(c, s, m){
    let string = `${m}:${s}:${c}`
    return string;
}

function toggleButtons(){
    if(startButton.style.display === "none"){
        startButton.style.display = "block";
        resetButton.style.display = "block";
        stopButton.style.display = "none";
        lapButton.style.display = "none";
    } else {
        startButton.style.display = "none";
        resetButton.style.display = "none";
        stopButton.style.display = "block";
        lapButton.style.display = "block";
    }
    return;
}


function addToDeciseconds(){
    centiseconds = +centiseconds;
    seconds = +seconds;
    minutes = +minutes;
    centiseconds ++;
    if(centiseconds >= 100){
        centiseconds = 0;
        seconds ++;
    }
    if(seconds >= 60){
        seconds = 0;
        minutes ++;
    }
    centiseconds <= 9 ? centiseconds = `0${centiseconds}` : null;
    seconds <= 9 ? seconds = `0${seconds}` : null;
    minutes <= 9 ? minutes = `0${minutes}` : null;
    displayTextElement.innerText = updateDisplay(centiseconds,seconds,minutes)
    counter = setTimeout("addToDeciseconds()",10)
}

startButton.addEventListener("click", () => {
    addToDeciseconds();
    toggleButtons();
})

stopButton.addEventListener("click", () =>{
    clearTimeout(counter);
    toggleButtons();
})

resetButton.addEventListener("click", () =>{
    clearHistory();
    clearTimeout(counter);
    centiseconds = "00";
    seconds = "00";
    minutes = "00";
    displayTextElement.innerText = updateDisplay(centiseconds,seconds,minutes)
})

lapButton.addEventListener("click", () =>{
    lapCount ++;
    lapHistory[`Lap ${lapCount}`] = updateDisplay(centiseconds,seconds,minutes);
    let laps = Object.entries(lapHistory);
    let history = ``;
    laps.forEach(lap => {
        history += `${lap[0]} - - - - - - - - ${lap[1]}\n`
    });
    lapHistoryTextElement.innerText = history;
})


