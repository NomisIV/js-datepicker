# Datepicker

A lightweight and pure javascript and css datepicker. The datepicker.js-file provides a Datepicker object which can be connected to a DOM element.

## How to use

* Setup
* Configuration (`.config(settings)`)
* Accessing the date (`.getDate()`)
* Setting the date (`.setDate(Date)`)

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
* **disableddays** - a function which is passed the Date object of every day and shall return true or false to enable or disable.
* **format** - a function passed the selected day and shall return the text which is to be displayed in the connected DOM element.

### Accessing the date

The `.getDate()` function returns the selected date's date object

### Setting the date

The `.setDate()` function can be used to "manually" change the datepicker's date. The function automatically updates the DOM elements date.
