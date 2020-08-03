var _this = this;
/* ======== Time Constants ======== */
/* exported SECOND MINUTE HOUR DAY WEEK WEEKDAYS WEEKDAYS_SHORT MONTHS MONTHS_SHORT*/
var SECOND = 1000;
var MINUTE = SECOND * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var YEAR = DAY * 365.25;
var WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
var WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
var MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
Date.prototype.getWeek = function () {
    var yearStart = new Date(_this.getFullYear(), 0, 1);
    return Math.ceil(((_this.getTime() - yearStart.getTime()) / DAY +
        yearStart.getDay() +
        1) /
        7);
};
/* exported Datepicker */
var Datepicker = /** @class */ (function () {
    function Datepicker(host, s) {
        var _this = this;
        this.host = host;
        this.frame = document.createElement("div");
        this.frame.id = host.id + "-datepicker";
        this.frame.className = "datepicker";
        // Run config if settings are present
        if (s)
            this.config(s);
        // Show conditions
        window.onresize = function () {
            if (_this.display_state)
                _this.show(true);
        };
        this.host.onclick = function () {
            if (_this.display_state)
                _this.show(false);
            else {
                _this.load("days");
                _this.show(true);
            }
        };
    }
    // Load
    Datepicker.prototype.load = function (mode) {
        var _this = this;
        this.frame.innerHTML = "";
        // Head
        var head = document.createElement("div");
        this.frame.append(head);
        head.className = "head";
        // Prev
        var prev = document.createElement("span");
        head.append(prev);
        prev.innerHTML = "<<";
        // Center
        var center = document.createElement("span");
        head.append(center);
        // Next
        var next = document.createElement("span");
        head.append(next);
        next.innerHTML = ">>";
        // Table
        var table = document.createElement("table");
        this.frame.append(table);
        table.className = mode;
        var loadDays = function () {
            // Prev
            if (_this.first_date == undefined ||
                _this.date.getMonth() > _this.first_date.getMonth() ||
                _this.date.getFullYear() > _this.first_date.getFullYear()) {
                prev.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear(), _this.date.getMonth() - 1, 1);
                    _this.load("days");
                };
            }
            else
                prev.classList.add("disabled");
            // Center
            center.innerHTML =
                MONTHS[_this.date.getMonth()] + " " + _this.date.getFullYear();
            center.onclick = function () {
                _this.load("months");
            };
            // Next
            if (_this.last_date == undefined ||
                _this.date.getMonth() < _this.last_date.getMonth() ||
                _this.date.getFullYear() < _this.last_date.getFullYear()) {
                next.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear(), _this.date.getMonth() + 1, 1);
                    _this.load("days");
                };
            }
            else
                next.classList.add("disabled");
            // Header row (Weekdays)
            var row = document.createElement("tr");
            table.append(row);
            for (var day = 0; day < 7; day++) {
                var cell = document.createElement("th");
                cell.innerHTML =
                    WEEKDAYS_SHORT[_this.sunday ? day : (day + 1) % 7];
                row.append(cell);
            }
            // Dates
            var first_day_in_month = new Date(_this.date.getTime());
            first_day_in_month.setDate(1);
            var index = (_this.sunday ? 0 : 1) - (first_day_in_month.getDay() || 7);
            for (var y = 0; y < 6; y++) {
                var tr = document.createElement("tr");
                table.append(tr);
                var _loop_1 = function (x) {
                    var day = new Date(first_day_in_month.getTime());
                    day.setDate(day.getDate() + index);
                    var td = document.createElement("td");
                    tr.append(td);
                    td.innerHTML = day.getDate().toString();
                    // If available
                    if (_this.enabled_days(day) &&
                        day.getMonth() == _this.date.getMonth() &&
                        (_this.last_date
                            ? day.getTime() <= _this.last_date.getTime()
                            : true) &&
                        (_this.first_date
                            ? day.getTime() >= _this.first_date.getTime()
                            : true)) {
                        td.onclick = function () {
                            _this.setDate(day);
                            _this.show(false);
                        };
                    }
                    else
                        td.classList.add("disabled");
                    // If today
                    if (day.toDateString() == new Date().toDateString())
                        td.classList.add("today");
                    index++;
                };
                for (var x = 0; x < 7; x++) {
                    _loop_1(x);
                }
            }
        };
        var loadMonths = function () {
            // Prev
            if (_this.first_date == undefined ||
                _this.date.getFullYear() > _this.first_date.getFullYear()) {
                prev.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear() - 1, 1, 1);
                    _this.load("months");
                };
            }
            else
                prev.classList.add("disabled");
            // Year
            center.innerHTML = _this.date.getFullYear().toString();
            center.onclick = function () {
                _this.load("years");
            };
            // Next
            if (_this.last_date == undefined ||
                _this.date.getFullYear() < _this.last_date.getFullYear()) {
                next.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear() + 1, 1, 1);
                    _this.load("months");
                };
            }
            else
                next.classList.add("disabled");
            // Months
            for (var y = 0; y < 3; y++) {
                var row = document.createElement("tr");
                table.append(row);
                var _loop_2 = function (x) {
                    var index = y * 4 + x;
                    var day = new Date(_this.date.getFullYear(), index, 1);
                    var cell = document.createElement("td");
                    row.append(cell);
                    cell.innerHTML = MONTHS_SHORT[index];
                    if ((_this.first_date
                        ? day.getTime() >=
                            new Date(_this.first_date.getTime()).setDate(1)
                        : true) &&
                        (_this.last_date
                            ? day.getTime() <=
                                new Date(_this.last_date.getTime()).setDate(1)
                            : true)) {
                        cell.onclick = function () {
                            _this.date = new Date(_this.date.getFullYear(), index, 1);
                            _this.load("days");
                        };
                    }
                    else
                        cell.classList.add("disabled");
                    if (day.getFullYear() == new Date().getFullYear() &&
                        day.getMonth() == new Date().getMonth())
                        cell.classList.add("today");
                };
                for (var x = 0; x < 4; x++) {
                    _loop_2(x);
                }
            }
        };
        var loadYears = function () {
            // Prev
            if (_this.first_date == undefined ||
                _this.date.getFullYear() > _this.first_date.getFullYear() + 25) {
                prev.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear() - 25, 1, 1);
                    _this.load("years");
                };
            }
            else
                prev.classList.add("disabled");
            // Center
            center.innerHTML = _this.date.getFullYear().toString();
            center.classList.add("disabled");
            // Next
            if (_this.last_date == undefined ||
                _this.date.getFullYear() < _this.last_date.getFullYear() + 25) {
                next.onclick = function () {
                    _this.date = new Date(_this.date.getFullYear() + 25, 1, 1);
                    _this.load("years");
                };
            }
            else
                next.classList.add("disabled");
            // Years
            for (var y = 0; y < 5; y++) {
                var row = document.createElement("tr");
                table.append(row);
                var _loop_3 = function (x) {
                    var index = _this.date.getFullYear() -
                        (_this.date.getFullYear() % 25) +
                        y * 5 +
                        x;
                    var day = new Date(index, 0, 1);
                    var cell = document.createElement("td");
                    row.append(cell);
                    cell.innerHTML = index.toString();
                    if ((_this.first_date != undefined
                        ? day.getTime() >=
                            new Date(_this.first_date.getTime()).setDate(1)
                        : true) &&
                        (_this.last_date != undefined
                            ? day.getTime() <=
                                new Date(_this.last_date.getTime()).setDate(1)
                            : true)) {
                        cell.onclick = function () {
                            _this.date = new Date(index, 0, 1);
                            _this.load("months");
                        };
                    }
                    else
                        cell.classList.add("disabled");
                    if (day.getFullYear() == new Date().getFullYear())
                        cell.classList.add("today");
                };
                for (var x = 0; x < 5; x++) {
                    _loop_3(x);
                }
            }
        };
        switch (mode) {
            case "days":
                loadDays();
                break;
            case "months":
                loadMonths();
                break;
            case "years":
                loadYears();
                break;
            default:
                console.error(mode + " is not a supported mode");
        }
    };
    Datepicker.prototype.show = function (state) {
        if (state) {
            var host_rect = this.host.getBoundingClientRect();
            this.host.insertAdjacentElement("afterend", this.frame);
            var frame_rect = this.frame.getBoundingClientRect();
            var x = host_rect.x + (host_rect.width - frame_rect.width) / 2;
            var y = host_rect.y + host_rect.height + 16;
            this.frame.style.setProperty("top", y + "px");
            this.frame.style.setProperty("left", x + "px");
        }
        else
            this.frame.remove();
        this.display_state = state;
    };
    Datepicker.prototype.config = function (s) {
        // Error checking
        if (s.initial_date && !(s.initial_date instanceof Date))
            console.error("Date is not of type Date");
        if (s.first_date && !(s.first_date instanceof Date))
            console.error("Firstdate is not of type Date");
        if (s.last_date && !(s.last_date instanceof Date))
            console.error("Lastdate is not of type Date");
        if (s.first_date &&
            s.last_date &&
            s.first_date.getTime() >= s.last_date.getTime())
            console.error("Lastdate cannot precede Firstdate");
        if (s.enabled_days && typeof s.enabled_days != "function")
            console.error("enabled_days is not of type function");
        if (s.enabled_days && typeof s.format != "function")
            console.error("format is not of type function");
        if (s.first_day_of_week && typeof s.first_day_of_week != "string")
            console.error("First day of week is not a string");
        // Set default settins
        this.first_date = s.first_date || this.first_date;
        this.last_date = s.last_date || this.last_date;
        this.enabled_days =
            s.enabled_days ||
                this.enabled_days ||
                (function () {
                    return true;
                });
        this.format =
            s.format ||
                this.format ||
                (function (d) {
                    return d.toString();
                });
        // If the string includes "sun" (case insensitive)
        if (s.first_day_of_week)
            this.sunday = s.first_day_of_week.search(/sun/gi) != -1;
        else
            this.sunday = false;
        // Set the default date
        if (s.initial_date)
            this.date = s.initial_date;
        else if ((this.last_date ? Date.now() < this.last_date.getTime() : true) &&
            (this.first_date ? Date.now() > this.first_date.getTime() : true))
            this.date = new Date();
        else if (this.first_date && Date.now() < this.first_date.getTime())
            this.date = this.first_date;
        else
            this.date = this.last_date;
        if (this.enabled_days(this.date))
            this.host.value = this.format(this.date);
    };
    Datepicker.prototype.getDate = function () {
        return this.date;
    };
    Datepicker.prototype.setDate = function (date) {
        // error checking
        if (date < this.first_date || date > this.last_date)
            console.error(date + " is outside date range");
        if (!this.enabled_days(date)) {
            date = new Date(date.getTime() + DAY);
            this.setDate(date);
            return;
        }
        this.date = date;
        this.host.value = this.format(date);
        this.host.dispatchEvent(new Event("change"));
    };
    return Datepicker;
}());
