const book = DriveApp.getFileById('12DwnnzlwRMRJ5d0gakOmc8xQw0V5S4ak').getBlob().getDataAsString();
const token = '1476739596:AAEyV7EFAw8TTwDyLsN9DkvKS-slZ5K68BU';

/* -------------------------------------------------------------------------------
   ОБРАБОТЧИК событий бота
   ------------------------------------------------------------------------------- */
function doPost(e) {
  try {
    var update = JSON.parse(e.postData.contents);
    Debug(update);

    // проверяем тип полученного
    if (update.callback_query) {
      processCallbacks(update); // обработчик функций обратных
    } else if (update.message && update.message.bot_command) {
      processCommands(update); // обработчик команд через слэш
    } else {
      processMessages(update); // обработчик остальных сообщений
    }
  } catch (error) {
    Debug(error);
    Logger.log(error);
    bot_sendMessage(chatId, '<b>Ошибка:</b> ' + '<code>' + error + '</code>',0);
  }
}

/* -------------------------------------------------------------------------------
   ОБРАБОТЧИК обратных функций от клавиатур 
   ------------------------------------------------------------------------------- */
function processCallbacks(update) {
  try {
    var id_callback = update.callback_query.from.id;
    var data = update.callback_query.data;

    // ОБРАБАТЫВАЕМ КОМАНДЫ ОСНОВНОГО МЕНЮ КЛАВИАТУРЫ 
    switch (data) {
      case 'showHelp':
        bot_sendMessage(id_callback, "Запросили помощь: " + data,0);
        break;
      case 'showLinks':
        bot_sendMessage(id_callback, "Запросили ссылки: " + data,0);
        break;
      case 'showQuote':
        bot_sendMessage(id_callback, "Запросили цитата: " + data);
        break;
    }
  } catch (error) {
    Debug(error);
    Logger.log(error);
    bot_sendMessage(chatId, '<b>Ошибка:</b> ' + '<code>' + error + '</code>',0);
  }
}

/* -------------------------------------------------------------------------------
   ОБРАБОТЧИК комманд через слэш
   ------------------------------------------------------------------------------- */
function processCommands(update) {
  try {
    var msg = update.message;
    var chatId = msg.chat.id;

    switch (msg.text.toLowerCase()) {
      case '/start':
        bot_sendMessage(chatId, "Вот что я могу:", KEY_MAIN);
        break;
      case '/help' || "/help@UB_TBot":
        bot_sendMessage(chatId, "Тут будет помощь: " + msg.text,0);
        break;
      case '/links' || "/links@UB_TBot":
        bot_sendMessage(chatId, "Тут будут ссылки: " + msg.text,0);
        break;
      case '/quote' || "/quote@UB_TBot":
        bot_sendMessage(chatId, "Тут будет цитата: " + msg.text,0);
        break;
      case '/':
        bot_sendMessage(chatId, 'Выберите команду или напишите что искать после знака: "<strong>*</strong>"',0);
        break;
      default:
        bot_sendMessage(chatId, "Не знаю такой комманды: " + msg.text,0);
    }
  } catch (error) {
    Debug(error);
    Logger.log(error);
    bot_sendMessage(chatId, '<b>Ошибка:</b> ' + '<code>' + error + '</code>',0);
  }
}

/* -------------------------------------------------------------------------------
   ОБРАБОТЧИК остольных сообщений
   ------------------------------------------------------------------------------- */
function processMessages(update) {
  try {
    var msg = update.message;
    var chatId = msg.chat.id;
    var message = '';

    // ОБРАБАТЫВАЕМ КОМАНДЫ В СООБЩЕНИЯХ
    if (msg.text.indexOf('*') != -1) {

      var matches = msg.text.match(/\*(.+)/); // получаем поисковый запрос

      var regEx = new RegExp('(?=[^"]*' + matches[1] + ')(?:^|[A-ZА-Я0-9Ё])[^"]+\.', 'gi'); // ищем в тексте совпадения
      var arrayFindWords = book.match(regEx);

      // проверяем найдено что-то или нет
      if (arrayFindWords) {
        for (var i = 0; i < 10 && i < arrayFindWords.length; i++) {
          message += i + 1 + '\n' + arrayFindWords[i].replace(matches[1], '<code>' + matches[1] + '</code>') + '\n\n';
        }
        message += "<strong>Всего найдено:</strong> " + arrayFindWords.length;

        // Если длина сообщения превышает лимит то разбиваем его на несколько, иначе будет ошибка.
        if (message.length < 4096) {
          bot_sendMessage(chatId, message, INKEY_FIND);
        } else {
          for (var i = 0; i < 5 && i < arrayFindWords.length; i++) {
            message = i + 1 + '\n' + arrayFindWords[i].replace(matches[1], '<code>' + matches[1] + '</code>') + '\n\n';
            bot_sendMessage(chatId, message,0);
          }
        }
      }
      else {
        message = ' <strong>' + 'Ничего не найдено по запросу: ' + '</strong> \n' + matches[1];
        bot_sendMessage(chatId, message,0);
      }
    }
  } catch (error) {
    Debug(error);
    Logger.log(error);
    bot_sendMessage(chatId, '<b>Ошибка:</b> ' + '<code>' + error + '</code>',0);
  }
}


/* -------------------------------------------------------------------------------
   отправляет сообщение с клавиатурой или без
   ------------------------------------------------------------------------------- */
function bot_sendMessage(chatId, text, keyBoard) {

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
