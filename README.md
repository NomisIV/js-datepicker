# Datepicker

![GitHub top language](https://img.shields.io/github/languages/top/NomisIV/Datepicker)
![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/NomisIV/Datepicker)
![Code Climate issues](https://img.shields.io/codeclimate/issues/NomisIV/Datepicker)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/NomisIV/Datepicker)

A lightweight and pure javascript and css datepicker. The datepicker.js-file provides a Datepicker object which can be connected to a DOM element.

## Index

* Setup
* Configuration `.config(settings)`
* Accessing the date `.getDate()`
* Setting the date `.setDate(Date)`
* Constants and prototypes

### Setup

~~~~ JavaScript
const d = new Datepicker(document.getElementById("yourElement"));
~~~~

To set up a new datepicker, simply construct a new Datepicker object and pass the DOM element you want to connect it to as an argument.

### Configuring

~~~~ JavaScript
d.config({
    firstdate: [Date Object],
    lastdate: [Date Object],
    disableddays: [Function],
    format: [Function]
});
~~~~~

To configure the datepicker, use the `.config()` function.

* **firstdate** - any valid Date object.
* **lastdate** - any valid Date object greater than firstdate.
* **disableddays** - a function passed the Date object of every calendar day and should return true or false to enable or disable that particular day.
* **format** - a function passed the selected date and should return the text which is to be displayed in the connected DOM element. The function may use the constants and prototypes that comes with the Datepicker.js file.

An example of a valid configuration:

~~~~ JavaScript
d.config({
    firstdate: new Date(2019, 0, 1), // First of January 2019
    lastdate: new Date(2019, 11, 31), // Last December 2019
    disableddays: d => { return (d.getDay() > 0 && d.getDay() < 6); }, // Returns true if the date is between Sunday and Saturday (Weekdays)
    format: d => { return (months_short[d.getMonth()] + " " + d.getDate()); } // Returns MMM d
});
~~~~

### Accessing the date

The `.getDate()` function returns the selected date's date object

### Setting the date

The `.setDate()` function can be used to "manually" change the datepicker's date. The function automatically updates the DOM elements date.

### Constants and prototypes
The constants and prototypes included in the Datepicker.js file are:

* `weekdays` - a list of the full names of the weekdays, beginning with Monday.
* `weekdays_short` - a list of the short names of the weekdays, beginning with Mon.
* `months` - a list of the full names of the months.
* `months_short` - a list of the short names of the months.
* `SECOND` - a constant for the amount of milliseconds in a second.
* `MINUTE` - a constant for the amount of milliseconds in a minute.
* `HOUR` - a constant for the amount of milliseconds in an hour.
* `DAY` - a constant for the amount of milliseconds in a day.
* `WEEK` - a constant for the amount of milliseconds in a week.
* `.getWeekNumber()` - a Date object prototype which returns the week of the year.
