Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const today = new Date();
let reldate = today;

function load() {
    const table = document.getElementById("datepicker").children[0];
    
    // Header
    const row1 = document.createElement("tr");
    
    const prev = document.createElement("td");
    prev.innerHTML = "<<";
    prev.onclick = function () {
        reldate = new Date(reldate.getFullYear(), reldate.getMonth() - 1, 1);
        while (table.firstChild) table.removeChild(table.firstChild);
        load();
    };
    row1.append(prev);
    
    const month = document.createElement("th");
    month.innerHTML = months[reldate.getMonth()];
    month.colSpan = 5;
    row1.append(month);
    
    const next = document.createElement("td");
    next.innerHTML = ">>";
    next.onclick = function () {
        reldate = new Date(reldate.getFullYear(), reldate.getMonth() + 1, 1);
        while (table.firstChild) table.removeChild(table.firstChild);
        load();
    };
    row1.append(next);
    
    table.append(row1);
    
    const row2 = document.createElement("tr");
    for (let day = 0; day < 7; day++) {
        const cell = document.createElement("th");
        cell.innerHTML = weekdays_short[day];
        row2.append(cell);
    }
    table.append(row2);
    
    // Dates
    const first_day_in_month = new Date(reldate.getFullYear(), reldate.getMonth(), 1);
    let index = 0;
    for (let row = 0; row < 6; row++) {
        const tr = document.createElement("tr");
        for (let cell = 0; cell < 7; cell++) {
            const day = new Date(first_day_in_month.getTime() + DAY * (index - (first_day_in_month.getDay() || 7 - 1)));
            const td = document.createElement("td");
            td.innerHTML = day.getDate();
            if (day.getMonth() != reldate.getMonth()) td.className = "disabled";
            tr.append(td);
            index++;
        }
        table.append(tr);
    }
}