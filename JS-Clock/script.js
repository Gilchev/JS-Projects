const clockTextElement = document.querySelector("[data-clock]")
const dateTextElement = document.querySelector("[data-date]")
const calendarBox = document.querySelector("[data-calendar]")

let daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let calendarDays = [];

function createCalendarBoxes(){
    let boxElementString = `<div data-dateBox style="background-color:Grey;">
    <div data-dateNumber></div>
    <textarea data-dateBoxText></textarea>
</div>`
    for(let i = 42; i >= 1; i--){
        if(i % 7 === 0) {
            calendarBox.innerHTML =  boxElementString.concat(calendarBox.innerHTML);
            calendarBox.innerHTML =  boxElementString.concat(calendarBox.innerHTML);
            i--
        }
        else calendarBox.innerHTML = `<div data-dateBox style="background-color:Lightgrey;">
                <div data-dateNumber></div>
                 <textarea data-dateBoxText></textarea>
            </div>`.concat(calendarBox.innerHTML)
    }
}

function setDateTime(){
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let format = "AM";
    hours === 0 ? hours = 12 : null;
    if(hours > 12){
        hours -= 12;
        format = "PM"
    }
    hours <= 9 ? hours = `0${hours}` : null;
    minutes <= 9 ? minutes = `0${minutes}` : null;
    seconds <= 9 ? seconds = `0${seconds}` : null;
    clockTextElement.innerText = `${hours}:${minutes}:${seconds} ${format}`;
    document.title = `Clock - ${clockTextElement.innerText}`;
    let dayOfWeek = daysOfTheWeek[currentTime.getDay()];
    let dayOfMonth = currentTime.getDate();
    let month = months[currentTime.getMonth()];
    dateTextElement.innerText = `${dayOfWeek}, ${dayOfMonth} ${month}`
    setTimeout(setDateTime,1000);
}

function fillCalendar(){
    createCalendarBoxes();
    const dateBoxNumbers = document.querySelectorAll("[data-dateNumber]");
    let date = new Date(), year = date.getFullYear(), month = date.getMonth();
    let firstDay = new Date(year, month, 1);
    let lastDay = new Date(year, month + 1, 0);
    let firstDayOfMonth = firstDay.getDay();
    let lastDayOfMonth = lastDay.getDate();
    for(let i = firstDayOfMonth; i < lastDayOfMonth + firstDayOfMonth; i++){
        dateBoxNumbers[i-1].innerText = i - firstDayOfMonth + 1;
    }
}

setDateTime();
fillCalendar();

const dateBoxes = document.querySelectorAll("[data-dateBox]");
dateBoxes.forEach(box => {
    let contents = box.children;
    let currentTime = new Date();
    let dayOfMonth = currentTime.getDate();
    if(+contents[0].innerText === dayOfMonth){
        box.style.border = "thick solid #0000FF";
    }

});