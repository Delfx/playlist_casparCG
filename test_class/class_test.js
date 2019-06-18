const moment = require('moment');

const date = 1559073447000;

const converterDate = moment(date).format("YYYY-MM-DDTHH:mm");

console.log(converterDate);



