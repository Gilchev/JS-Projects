const displayTextElement = document.querySelector("[data-display]");
const resetButton = document.querySelector("[data-resetButton]");
const startButton = document.querySelector("[data-startButton]");
const lapButton = document.querySelector("[data-lapButton]");
const stopButton = document.querySelector("[data-stopButton]");
const lapHistoryTextElement = document.querySelector("[data-lapHistory]");

stopButton.style.display = "none";
lapButton.style.display = "none";
let lapCount = 0;
let previousLap = 0;
let lapHistory = {};
let centiseconds = 0;
let counter;
//finds shortest and longest lap and replaces them with an added span to color-code them accordingly
function colorLaps(){
    let sortedLaps = Object.entries(lapHistory).sort((a,b) => a[1] - b[1]);
    let shortestLap = sortedLaps[0][0];
    let longestLap = sortedLaps[sortedLaps.length - 1][0];
    let shortestLapKey = `${shortestLap} - - - - - - - - ${updateDisplay(sortedLaps[0][1])}`;
    let longestLapKey = `${longestLap} - - - - - - - - ${updateDisplay(sortedLaps[sortedLaps.length - 1][1])}`;
    let lapHistoryHtml = lapHistoryTextElement.innerHTML;
    lapHistoryHtml = lapHistoryHtml.replace(shortestLapKey,`<span style="color:Green;">${shortestLapKey}</span>`);
    lapHistoryHtml = lapHistoryHtml.replace(longestLapKey,`<span style="color:Red;">${longestLapKey}</span>`);
    lapHistoryTextElement.innerHTML = lapHistoryHtml;
}
//resets lapcount, clears the lap history text, and deletes all properties of lapHistory object
function clearHistory(){
    lapCount = 0;
    lapHistoryTextElement.innerText = ``;
    for (const key of Object.keys(lapHistory)) {
        delete lapHistory[key];
    }
    return;
}
//calculates formats and returns minutes:seconds:centiseconds from any amount of centiseconds
function updateDisplay(centi){
    let minutes = Math.floor(centi / 6000);
    minutes <= 9 ? minutes = `0${minutes}` : null;
    centi %= 6000;
    let seconds = Math.floor(centi / 100);
    seconds <= 9 ? seconds = `0${seconds}` : null;
    centi %= 100
    centi <= 9 ? centi = `0${centi}` : null;
    return `${minutes}:${seconds}:${centi}`;
}
//toggles between the two button pairs (start/stop & lap/reset) when start or stop is pressed
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
//every 10 milliseconds adds 1 to centiseconds counter and updates display
function addToDeciseconds(){
    centiseconds ++
    displayTextElement.innerText = updateDisplay(centiseconds);
    counter = setTimeout("addToDeciseconds()",10)
}
//starts addToDeciseconds timer and toggles buttons
startButton.addEventListener("click", () => {
    addToDeciseconds();
    toggleButtons();
})
//stops addToDeciseconds timer(without deleting any data) and toggles buttons
stopButton.addEventListener("click", () =>{
    clearTimeout(counter);
    toggleButtons();
})
//stops addToDeciseconds timer, clears all history, resets laps and total centiseconds
resetButton.addEventListener("click", () =>{
    clearHistory();
    clearTimeout(counter);
    centiseconds = 0;
    previousLap = 0;
    displayTextElement.innerText = updateDisplay(centiseconds)
})
//calculates time passed since last lap and adds them to history object
//then formats each entry in it and add to history display
//if there are 3 or more entries, calls the colorLaps function
lapButton.addEventListener("click", () =>{
    lapCount ++;
    lapHistory[`Lap ${lapCount}`] = centiseconds - previousLap;
    previousLap = centiseconds;
    let laps = Object.entries(lapHistory);
    let history = ``;
    laps.forEach(lap => {
        history += `${lap[0]} - - - - - - - - ${updateDisplay(lap[1])}\n`
    });
    lapHistoryTextElement.innerText = history;
    if(Object.keys(lapHistory).length >= 3){
        colorLaps();
    }
})


