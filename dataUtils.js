function getToday() {
  let date = new Date();
  let dateStr = `${date.getDate()} / ${date.getMonth() +1} / ${date.getFullYear() - 2000}`;

  if (Math.random() > 0.5) {
    dateStr =  `${date.getDate()}.${date.getMonth() +1}.${date.getFullYear() - 2000}`;
  }
  return dateStr;
}

var TODAY_STR = getToday();
var DAY_STR = ' ';
var MONTH_STR = ' ';
var YEAR_STR = TODAY_STR;
var YEAR_INT = (new Date()).getFullYear();