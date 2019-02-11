// GLOBAL CONSTANTS
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdays_short = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// PROTOTYPES
Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

HTMLElement.prototype.clear = function () {
    while (this.firstChild) this.removeChild(this.firstChild);
};

// DATEPICKER
class Datepicker {
    constructor(host) {
        this.host = host;
        
        document.addEventListener("click", e => {
            if (e.target == document.getElementById("datepicker") && document.body.lastChild != document.getElementById("datepicker-frame")) this.load(new Date());
        });
        window.onresize = () => { if (this.display_state) this.show(true); };
    }
    
    config(s) {
        this.firstdate = s.firstdate || this.firstdate;
        this.lastdate = s.lastdate || this.lastdate;
        this.disableddays = s.disableddays || this.disableddays;
        this.format = s.format || this.format;
        
        if (typeof this.firstdate != "object") console.error("firstdate is not of type Object");
        else if (typeof this.lastdate != "object") console.error("lastdate is not of type Object");
        else if (typeof this.disableddays != "function") console.error("disableddays is not of type function");
        else if (typeof this.format != "function") console.error("format is not of type function");
    }
    
    month(rel_index) {
        this.frame.clear();
        this.load(new Date(this.date.getFullYear(), this.date.getMonth() + rel_index, 1));
    }
    
    selectDate(d) {
        this.date = d;
        this.host.value = this.format(d);
        document.body.removeChild(document.getElementById("datepicker-frame"));
        this.host.onchange();
    }
    
    load(d) {
        this.date = d.getTime() <= this.lastdate.getTime() ? d : this.firstdate;
        
        if (document.getElementById("datepicker-frame")) this.frame = document.getElementById("datepicker-frame");
        else {
            this.frame = document.createElement("div");
            document.body.append(this.frame);
        }
        this.frame.id = "datepicker-frame";
        
        this.datepicker = document.getElementById("datepicker-frame");        
        
        const x = (this.host.getBoundingClientRect().left + this.host.getBoundingClientRect().right) / 2;
        const y = this.host.getBoundingClientRect().bottom - this.host.getBoundingClientRect().top + document.documentElement.scrollTop;
        this.datepicker.style.display = "block";
        this.datepicker.style.setProperty("top", y + 20 + "px");
        this.datepicker.style.setProperty("left", x - 152 + "px");
        
        this.table = document.getElementById("datepicker-frame").children[0] || document.createElement("table");
        this.frame.append(this.table);
            
        // Header
        const row1 = document.createElement("tr");
        this.table.append(row1);
        
        const prev = document.createElement("th");
        row1.append(prev);
        prev.innerHTML = "<<";
        if (this.date.getMonth() > this.firstdate.getMonth()) {
            prev.className = "pointer";
            prev.onclick = () => { this.month(-1); };
        } else prev.className = "disabled";
        
        const head = document.createElement("th");
        row1.append(head);
        head.colSpan = 5;
        head.innerHTML = months[this.date.getMonth()] + " " + this.date.getFullYear();
        
        const next = document.createElement("th");
        row1.append(next);
        next.innerHTML = ">>";
        if (this.date.getMonth() < this.lastdate.getMonth()) {
            next.className = "pointer";
            next.onclick = () => { this.month(1); };
        } else next.className = "disabled";
        
        const row2 = document.createElement("tr");
        this.table.append(row2);
        for (let day = 0; day < 7; day++) {
            const cell = document.createElement("th");
            cell.innerHTML = weekdays_short[day];
            row2.append(cell);
        }
        
        // Dates
        const first_day_in_month = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        let index = 0;
        for (let row = 0; row < 6; row++) {
            const tr = document.createElement("tr");
            this.table.append(tr);
            for (let cell = 0; cell < 7; cell++) {
                const day = new Date(first_day_in_month.getTime() + DAY * (index - (first_day_in_month.getDay() || 7 - 1)));
                
                const td = document.createElement("td");
                tr.append(td);
                td.innerHTML = day.getDate();
                
                const class_enabled = day.getMonth() == this.date.getMonth() && (
                    day.getMonth() == this.firstdate.getMonth() ? day.getDate() > this.firstdate.getDate() :
                        day.getMonth() == this.lastdate.getMonth() ? day.getDate() < this.lastdate.getDate() :
                            this.firstdate.getMonth() <= day.getMonth() <= this.lastdate.getMonth()
                ) && this.disableddays(day) ? "pointer" : "disabled";
                        
                const d = new Date();
                const class_today = (
                    day.getFullYear() == d.getFullYear() &&
                    day.getMonth() == d.getMonth() &&
                    day.getDate() == d.getDate()
                ) ? " today" : "";
                
                td.className = class_enabled + class_today;
                td.onclick = () => { this.selectDate(day); };
                index++;
            }
        }
    }
    
    show(bool) {
        this.display_state = bool;
        if (bool) {
            const x = (this.host.getBoundingClientRect().left + this.host.getBoundingClientRect().right) / 2;
            const y = this.host.getBoundingClientRect().bottom - this.host.getBoundingClientRect().top + document.documentElement.scrollTop;
            this.frame.style.display = "block";
            this.frame.style.setProperty("top", y + 20 + "px");
            this.frame.style.setProperty("left", x - 150 + "px");
        } else if (!bool) {
            this.frame.style.display = "none";
        }
    }
    
    getDate() {
        return this.date;
    }
    
    setDate(date) {
        this.date = date;
        this.host.value = this.format(date);
        this.host.onchange();
    }
}