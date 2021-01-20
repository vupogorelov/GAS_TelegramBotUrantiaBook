
var file = DriveApp.getFileById('12DwnnzlwRMRJ5d0gakOmc8xQw0V5S4ak');
const book = file.getBlob().getDataAsString();
const token = '1476739596:AAEyV7EFAw8TTwDyLsN9DkvKS-slZ5K68BU';
// var bot = new TGbot(token);



function bot_sendMessage(chatId, text) {
  //формируем сообщение
  let payload = {
    'method': 'sendMessage',
    'chat_id': String(chatId),
    'text': text,
    'parse_mode': 'HTML'
  }
  let data = {
    "method": "post",
    "payload": payload
  }

  // и отправляем его боту 
  return UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);

}

function bot_sendMessageKeyboard(chatId, text, keyBoard) {

  keyBoard = keyBoard || 0;

  if (keyBoard.inline_keyboard || keyBoard.keyboard) {
    var data = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String(chatId),
        text: text,
        parse_mode: "HTML",
        reply_markup: JSON.stringify(keyBoard)
      }
    }
  } else {
    // @ts-ignore
    var data = {
      method: "post",
      payload: {
        method: "sendMessage",
        chat_id: String(chatId),
        text: text,
        parse_mode: "HTML"
      }
    }
  }

  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);

}

function setWebhook() {
  var webAppUrl = 'https://script.google.com/macros/s/AKfycbxJWROXwCbP5wQkleeuQxlUurL1L2kRqk8ReNSA2rRQSO9IHGe7sR1c/exec';
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var result = UrlFetchApp.fetch(url);

  Logger.log(webAppUrl);
  Logger.log(token);
  Logger.log(result);
}
