# The JavaScript Datepicker

![GitHub top language](https://img.shields.io/github/languages/top/NomisIV/Datepicker)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/NomisIV/Datepicker)
![Code Climate issues](https://img.shields.io/codeclimate/issues/NomisIV/Datepicker)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/NomisIV/Datepicker)

A lightweight and customizable datepicker, built in TypeScript without any dependencies.

## Features

- **Lightweight**: under 500 lines of TypeScript.
- **Customizable**: you can use your own stylesheets, or modify the existing one.
- **No dependencies**: no bloat.
- **Configurable**: configure using JavaScript dates and functions.

## Setup

```JavaScript
const d = new Datepicker(document.getElementById("yourElement"));
```

To set up a datepicker, simply create a new Datepicker object and pass the DOM element you want to connect it to as an argument.

## Configuring

```JavaScript
d.config({
    first_date: [Date Object],
    last_date: [Date Object],
    initial_date: [Date Object],
    enabled_days: [Function],
    format: [Function],
    first_day_of_week: "Monday" | "Sunday"
});
```

To configure the datepicker, the `Datepicker.config()` function is used.
Alternatively, the configuration object can be passed as a second parameter to the constructor.

- **first_date** - any valid Date object.
- **last_date** - any valid Date object preceding first_date.
- **initial_date** - any valid Date object between first_date and last_date
- **enabled_days** - a function which returns true or false to enable or disable that particular day.
- **format** - a function which formats the date before displaying it in the input element.
- **first_day_of_week** - a string containing either "Monday" or "Sunday"

All settings are optional.

An example of a valid configuration:

```JavaScript
d.config({
    first_date: new Date(0), // First of January 1970
    last_date: new Date(), // Today
    initial_date: new Date(2002, 02, 19) // My birthday
    enabled_days: d => {
        return (d.getDay() > 0 && d.getDay() < 6);
    }, // Returns true for weekdays
    format: d => {
        return [
            WEEKDAYS_SHORT[d.getDay()],
            d.getDate(),
            MONTHS_SHORT[d.getMonth()],
            d.getFullYear(),
        ].join(" ");
    } // Returns ex. Mon 03 Aug 2020
    first_day_of_week: "back-to-work-day" // Anything not containing "sun" (case insensitive) is considered to be monday
});
```

## Accessing the date

The `.getDate()` function returns the selected date's date object

## Setting the date

The `.setDate()` function can be used to "manually" change the datepicker's date.
The function automatically updates the DOM elements displayed date.

## Constants and prototypes

The constants and prototypes included in the Datepicker.js file are:

- `WEEKDAYS` - a list of the full names of the weekdays, beginning with Monday.
- `WEEKDAYS_SHORT` - a list of the short names of the weekdays, beginning with Mon.
- `MONTHS` - a list of the full names of the months.
- `MONTHS_SHORT` - a list of the short names of the months.
- `SECOND` - a constant for the amount of milliseconds in a second.
- `MINUTE` - a constant for the amount of milliseconds in a minute.
- `HOUR` - a constant for the amount of milliseconds in an hour.
- `DAY` - a constant for the amount of milliseconds in a day.
- `WEEK` - a constant for the amount of milliseconds in a week.
- `YEAR` - a constant for the amount of milliseconds in a year. (365.25 DAYs)
- `.getWeek()` - a Date object prototype which returns the week of the year.
