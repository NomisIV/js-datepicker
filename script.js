const weekdays = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays", "Sundays"];
const weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "October", "November", "December"];
const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Nov", "Dec"];

let d = new Date();

function load() {
    const table = document.getElementById("dates");
    
    // Header
    const tr1 = document.createElement("tr");
    const td = document.createElement("td");
    td.innerHTML = months[d.getMonth()];
    tr1.append(td);
    table.append(tr1);
    
    const tr2 = document.createElement("tr");
    for (let day = 0; day < 7; day++) {
        const th = document.createElement("th");
        th.innerHTML = weekdays_short[day];
        tr2.append(th);
    }
    table.append(tr2);
    
    // Row
    let day = 0;
    for (let row = 0; row < 6; row++) {
        const tr = document.createElement("tr");
        for (let cell = 0; cell < 7; cell++) {
            const td = document.createElement("td");
            td.innerHTML = day;
            day++;
            tr.append(td);
        }
        table.append(tr);
    }
}