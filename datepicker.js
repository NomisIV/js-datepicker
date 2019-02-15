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
        const t = this;
        t.host = host;
        
        window.onresize = () => { if (t.display_state) show(true); };
        document.addEventListener("click", e => {
            if (
                e.target == document.getElementById("datepicker") &&
                !document.getElementById("datepicker-frame")
            ) {
                this.load();
                show(true);
            }
            else if (
                document.getElementById("datepicker-frame") != null &&
                !e.path.includes(document.getElementById("datepicker-frame"))
            ) show(false);
        });
        
        this.load = function () {
            if (document.getElementById("datepicker-frame")) t.frame = document.getElementById("datepicker-frame");
            else {
                t.frame = document.createElement("div");
            }
            t.frame = document.getElementById("datepicker-frame") ?
                document.getElementById("datepicker-frame") : document.createElement("div");
            t.frame.id = "datepicker-frame";

            t.table = document.createElement("table");
            t.frame.append(t.table);
            
            t.table.className = "noselect";

            // Header
            const row1 = document.createElement("tr");
            t.table.append(row1);

            const prev = document.createElement("th");
            row1.append(prev);
            prev.innerHTML = "<<";
            if (t.firstdate == undefined || (
                t.date.getMonth() > t.firstdate.getMonth() ||
                t.date.getFullYear() > t.firstdate.getFullYear())
            ) {
                prev.className = "pointer";
                prev.onclick = () => { month(-1); };
            } else prev.className = "disabled";

            const head = document.createElement("th");
            row1.append(head);
            head.colSpan = 5;
            head.innerHTML = months[t.date.getMonth()] + " " + t.date.getFullYear();

            const next = document.createElement("th");
            row1.append(next);
            next.innerHTML = ">>";
            if (t.lastdate == undefined || (
                t.date.getMonth() < t.lastdate.getMonth() ||
                t.date.getFullYear() < t.lastdate.getFullYear())
            ) {
                next.className = "pointer";
                next.onclick = () => { month(1); };
            } else next.className = "disabled";

            const row2 = document.createElement("tr");
            t.table.append(row2);
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement("th");
                cell.innerHTML = weekdays_short[day];
                row2.append(cell);
            }

            // Dates
            const first_day_in_month = new Date(t.date.getFullYear(), t.date.getMonth(), 1);
            let index = 1 - (first_day_in_month.getDay() || 7);
            for (let row = 0; row < 6; row++) {
                const tr = document.createElement("tr");
                t.table.append(tr);
                for (let cell = 0; cell < 7; cell++) {
                    const day = new Date(first_day_in_month.getTime() + DAY * index);
                    
                    const td = document.createElement("td");
                    tr.append(td);
                    td.innerHTML = day.getDate();

                    let class_name = day.getMonth() == t.date.getMonth() && t.disableddays(day) && (
                        t.firstdate == undefined ? true : (
                            day.getMonth() == t.firstdate.getMonth() ? (
                                day.getFullYear() == t.firstdate.getFullYear() ?
                                    day.getDate() >= t.firstdate.getDate() : true
                            ) : true
                        )
                    ) && (
                        t.lastdate == undefined ? true : (
                            day.getMonth() == t.lastdate.getMonth() ? (
                                day.getFullYear() == t.lastdate.getFullYear() ?
                                    day.getDate() <= t.lastdate.getDate() : true
                            ) : true
                        )
                    ) ? "pointer" : "disabled";
                    
                    class_name += day.toDateString() == new Date().toDateString() ? " today" : "";

                    td.className = class_name;
                    td.onclick = class_name == "pointer" ? (() => { selectDate(day); }) : undefined;
                    index++;
                }
            }
        };
        
        const show = function (bool) {
            if (bool) {
                const rect = t.host.getBoundingClientRect();
                const x = (rect.left + rect.right) / 2;
                const y = rect.bottom - rect.top + document.documentElement.scrollTop;
                t.frame.style.setProperty("top", y + 20 + "px");
                t.frame.style.setProperty("left", x - 152 + "px");
                
                document.body.append(t.frame);
            }
            else if (!bool) document.getElementById("datepicker-frame").remove();
        };
        
        const month = function (rel_index) {
            t.frame.clear();
            t.date = new Date(t.date.getFullYear(), t.date.getMonth() + rel_index, 1);
            t.load();
        };

        const selectDate = function (d) {
            t.date = d;
            t.host.value = t.format(d);
            if (t.host.onchange != undefined) t.host.onchange();
            show(false);
        };
    }
    
    config(s) {
        this.firstdate = s.firstdate || this.firstdate;
        this.lastdate = s.lastdate || this.lastdate;
        this.disableddays = s.disableddays || this.disableddays || (() => { return true;});
        this.format = s.format || this.format || ((d) => { return d;});
        
        if (typeof this.firstdate != "object" && this.firstdate != undefined) console.error("firstdate is not of type Object");
        else if (typeof this.lastdate != "object" && this.lastdate != undefined) console.error("lastdate is not of type Object");
        else if (typeof this.disableddays != "function") console.error("disableddays is not of type function");
        else if (typeof this.format != "function") console.error("format is not of type function");
        
        const d = new Date();
        this.date = this.date || (
            this.firstdate && this.lastdate ? (
                d.getTime() >= this.firstdate.getTime() && d.getTime() <= this.lastdate.getTime() ? d : this.firstdate
            ) : this.firstdate ? (
                d.getTime() >= this.firstdate.getTime() ? d : this.firstdate
            ) : this.lastdate ? (
                d.getTime() <= this.lastdate.getTime() ? d : this.lastdate
            ) : d
        );
        this.host.value = this.format(this.date);
    }
    
    getDate() {
        return this.date;
    }
    
    setDate(date) {
        if (!this.disableddays(date)) return ("ERR_DISABLED");
        this.date = date;
        this.host.value = this.format(date);
        this.load();
        if(typeof this.host.onchange == "function") this.host.onchange();
    }
}