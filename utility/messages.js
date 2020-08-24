// const we are importing moment Js which we installed as dependencies
const moment = require('moment');

function formatMessage(username, text){
    return {
        username,
        text,
        /* moment js fetches the moment for the real time chat experience,
           so we use format function because to format the thime in to (H - hours, mm - minutes, a - am (or) pm) 
        */
        time: moment().format('h:mm a')
    }
}
// we have to export from here to use it in server.js
module.exports = formatMessage;