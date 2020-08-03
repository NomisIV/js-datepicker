/* ======== Time Constants ======== */
/* exported SECOND MINUTE HOUR DAY WEEK WEEKDAYS WEEKDAYS_SHORT MONTHS MONTHS_SHORT*/
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const YEAR = DAY * 365.25;

const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
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
const MONTHS_SHORT = [
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

/* ======== Add getWeek Prototype ======== */
interface Date {
    getWeek(): number;
}

Date.prototype.getWeek = () => {
    const yearStart = new Date(this.getFullYear(), 0, 1);
    return Math.ceil(
        ((this.getTime() - yearStart.getTime()) / DAY +
            yearStart.getDay() +
            1) /
            7
    );
};

/* ======== Datepicker Class ======== */
interface DatepickerSettings {
    first_date: Date;
    last_date: Date;
    initial_date: Date;
    enabled_days(d: Date): boolean;
    format(d: Date): string;
    first_day_of_week: string;
}

/* exported Datepicker */
class Datepicker {
    host: HTMLInputElement;
    frame: HTMLDivElement;
    private display_state: boolean;
    first_date: Date;
    last_date: Date;
    protected date: Date;
    enabled_days: Function;
    format: Function;
    protected sunday: boolean;

    constructor(host: HTMLInputElement, s: DatepickerSettings) {
        this.host = host;
        this.frame = document.createElement("div");
        this.frame.id = host.id + "-datepicker";
        this.frame.className = "datepicker";

        // Run config if settings are present
        if (s) this.config(s);

        // Show conditions
        window.onresize = () => {
            if (this.display_state) this.show(true);
        };

        this.host.onclick = () => {
            if (this.display_state) this.show(false);
            else {
                this.load("days");
                this.show(true);
            }
        };
    }

    // Load
    private load(mode: "days" | "months" | "years") {
        this.frame.innerHTML = "";

        // Head
        const head = document.createElement("div");
        this.frame.append(head);
        head.className = "head";

        // Prev
        const prev = document.createElement("span");
        head.append(prev);
        prev.innerHTML = "<<";

        // Center
        const center = document.createElement("span");
        head.append(center);

        // Next
        const next = document.createElement("span");
        head.append(next);
        next.innerHTML = ">>";

        // Table
        const table = document.createElement("table");
        this.frame.append(table);
        table.className = mode;

        const loadDays = () => {
            // Prev
            if (
                this.first_date == undefined ||
                this.date.getMonth() > this.first_date.getMonth() ||
                this.date.getFullYear() > this.first_date.getFullYear()
            ) {
                prev.onclick = () => {
                    this.date = new Date(
                        this.date.getFullYear(),
                        this.date.getMonth() - 1,
                        1
                    );
                    this.load("days");
                };
            } else prev.classList.add("disabled");

            // Center
            center.innerHTML =
                MONTHS[this.date.getMonth()] + " " + this.date.getFullYear();
            center.onclick = () => {
                this.load("months");
            };

            // Next
            if (
                this.last_date == undefined ||
                this.date.getMonth() < this.last_date.getMonth() ||
                this.date.getFullYear() < this.last_date.getFullYear()
            ) {
                next.onclick = () => {
                    this.date = new Date(
                        this.date.getFullYear(),
                        this.date.getMonth() + 1,
                        1
                    );
                    this.load("days");
                };
            } else next.classList.add("disabled");

            // Header row (Weekdays)
            const row = document.createElement("tr");
            table.append(row);
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement("th");
                cell.innerHTML =
                    WEEKDAYS_SHORT[this.sunday ? day : (day + 1) % 7];
                row.append(cell);
            }

            // Dates
            const first_day_in_month = new Date(this.date.getTime());
            first_day_in_month.setDate(1);
            let index =
                (this.sunday ? 0 : 1) - (first_day_in_month.getDay() || 7);
            for (let y = 0; y < 6; y++) {
                const tr = document.createElement("tr");
                table.append(tr);
                for (let x = 0; x < 7; x++) {
                    let day = new Date(first_day_in_month.getTime());
                    day.setDate(day.getDate() + index);

                    const td = document.createElement("td");
                    tr.append(td);
                    td.innerHTML = day.getDate().toString();

                    // If available
                    if (
                        this.enabled_days(day) &&
                        day.getMonth() == this.date.getMonth() &&
                        (this.last_date
                            ? day.getTime() <= this.last_date.getTime()
                            : true) &&
                        (this.first_date
                            ? day.getTime() >= this.first_date.getTime()
                            : true)
                    ) {
                        td.onclick = () => {
                            this.setDate(day);
                            this.show(false);
                        };
                    } else td.classList.add("disabled");

                    // If today
                    if (day.toDateString() == new Date().toDateString())
                        td.classList.add("today");

                    index++;
                }
            }
        };

        const loadMonths = () => {
            // Prev
            if (
                this.first_date == undefined ||
                this.date.getFullYear() > this.first_date.getFullYear()
            ) {
                prev.onclick = () => {
                    this.date = new Date(this.date.getFullYear() - 1, 1, 1);
                    this.load("months");
                };
            } else prev.classList.add("disabled");

            // Year
            center.innerHTML = this.date.getFullYear().toString();
            center.onclick = () => {
                this.load("years");
            };

            // Next
            if (
                this.last_date == undefined ||
                this.date.getFullYear() < this.last_date.getFullYear()
            ) {
                next.onclick = () => {
                    this.date = new Date(this.date.getFullYear() + 1, 1, 1);
                    this.load("months");
                };
            } else next.classList.add("disabled");

            // Months
            for (let y = 0; y < 3; y++) {
                const row = document.createElement("tr");
                table.append(row);
                for (let x = 0; x < 4; x++) {
                    const index = y * 4 + x;
                    const day = new Date(this.date.getFullYear(), index, 1);

                    const cell = document.createElement("td");
                    row.append(cell);
                    cell.innerHTML = MONTHS_SHORT[index];

                    if (
                        (this.first_date
                            ? day.getTime() >=
                              new Date(this.first_date.getTime()).setDate(1)
                            : true) &&
                        (this.last_date
                            ? day.getTime() <=
                              new Date(this.last_date.getTime()).setDate(1)
                            : true)
                    ) {
                        cell.onclick = () => {
                            this.date = new Date(
                                this.date.getFullYear(),
                                index,
                                1
                            );
                            this.load("days");
                        };
                    } else cell.classList.add("disabled");
                    if (
                        day.getFullYear() == new Date().getFullYear() &&
                        day.getMonth() == new Date().getMonth()
                    )
                        cell.classList.add("today");
                }
            }
        };

        const loadYears = () => {
            // Prev
            if (
                this.first_date == undefined ||
                this.date.getFullYear() > this.first_date.getFullYear() + 25
            ) {
                prev.onclick = () => {
                    this.date = new Date(this.date.getFullYear() - 25, 1, 1);
                    this.load("years");
                };
            } else prev.classList.add("disabled");

            // Center
            center.innerHTML = this.date.getFullYear().toString();
            center.classList.add("disabled");

            // Next
            if (
                this.last_date == undefined ||
                this.date.getFullYear() < this.last_date.getFullYear() + 25
            ) {
                next.onclick = () => {
                    this.date = new Date(this.date.getFullYear() + 25, 1, 1);
                    this.load("years");
                };
            } else next.classList.add("disabled");

            // Years
            for (let y = 0; y < 5; y++) {
                const row = document.createElement("tr");
                table.append(row);
                for (let x = 0; x < 5; x++) {
                    const index =
                        this.date.getFullYear() -
                        (this.date.getFullYear() % 25) +
                        y * 5 +
                        x;
                    const day = new Date(index, 0, 1);

                    const cell = document.createElement("td");
                    row.append(cell);
                    cell.innerHTML = index.toString();

                    if (
                        (this.first_date != undefined
                            ? day.getTime() >=
                              new Date(this.first_date.getTime()).setDate(1)
                            : true) &&
                        (this.last_date != undefined
                            ? day.getTime() <=
                              new Date(this.last_date.getTime()).setDate(1)
                            : true)
                    ) {
                        cell.onclick = () => {
                            this.date = new Date(index, 0, 1);
                            this.load("months");
                        };
                    } else cell.classList.add("disabled");
                    if (day.getFullYear() == new Date().getFullYear())
                        cell.classList.add("today");
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
    }

    show(state: boolean) {
        if (state) {
            const host_rect = this.host.getBoundingClientRect();
            this.host.insertAdjacentElement("afterend", this.frame);
            const frame_rect = this.frame.getBoundingClientRect();

            const x = host_rect.x + (host_rect.width - frame_rect.width) / 2;
            const y = host_rect.y + host_rect.height + 16;

            this.frame.style.setProperty("top", y + "px");
            this.frame.style.setProperty("left", x + "px");
        } else this.frame.remove();
        this.display_state = state;
    }

    config(s: DatepickerSettings) {
        // Error checking
        if (s.initial_date && !(s.initial_date instanceof Date))
            console.error("Date is not of type Date");

        if (s.first_date && !(s.first_date instanceof Date))
            console.error("Firstdate is not of type Date");

        if (s.last_date && !(s.last_date instanceof Date))
            console.error("Lastdate is not of type Date");

        if (
            s.first_date &&
            s.last_date &&
            s.first_date.getTime() >= s.last_date.getTime()
        )
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
            (() => {
                return true;
            });
        this.format =
            s.format ||
            this.format ||
            ((d: Date) => {
                return d.toString();
            });
        // If the string includes "sun" (case insensitive)
        if (s.first_day_of_week)
            this.sunday = s.first_day_of_week.search(/sun/gi) != -1;
        else this.sunday = false;

        // Set the default date
        if (s.initial_date) this.date = s.initial_date;
        else if (
            (this.last_date ? Date.now() < this.last_date.getTime() : true) &&
            (this.first_date ? Date.now() > this.first_date.getTime() : true)
        )
            this.date = new Date();
        else if (this.first_date && Date.now() < this.first_date.getTime())
            this.date = this.first_date;
        else this.date = this.last_date;

        if (this.enabled_days(this.date))
            this.host.value = this.format(this.date);
    }

    getDate() {
        return this.date;
    }

    setDate(date: Date) {
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
    }
}
