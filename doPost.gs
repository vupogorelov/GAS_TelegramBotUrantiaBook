function doPost(e) {
  // получаем сигнал от бота
  var update = JSON.parse(e.postData.contents);
  Logger.log(update);

  try {

    // проверяем тип полученного, нам нужен только тип "колбэк"
    if (update.callback_query) {
      var id_callback = update.callback_query.from.id;
      var data = update.callback_query.data;

      // ОБРАБАТЫВАЕМ КОМАНДЫ ОСНОВНОГО МЕНЮ КЛАВИАТУРЫ 
      switch (data) {
        case 'showHelp':
          bot_sendMessage(id_callback, "Запросили помощь: " + data);
          break;
        case 'showLinks':
          bot_sendMessage(id_callback, "Запросили ссылки: " + data);
          break;
        case 'showQuote':
          bot_sendMessage(id_callback, "Запросили цитата: " + data);
          break;
      }
    }

    // проверяем тип полученного, нам нужен только тип "сообщение"
    if (update.message) {
      var msg = update.message;
      var chatId = msg.chat.id;
      var message = '';

      // ОБРАБАТЫВАЕМ ВСТРОЕННЫЕ КОМАНДЫ БОТА "/"
      if (msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command') {

        switch (msg.text.toLowerCase()) {
          case '/start':
            bot_sendMessageKeyboard(chatId, "Вот что я могу:", KEY_MAIN);
            break;
          case '/help' || "/help@UB_TBot":
            bot_sendMessage(chatId, "Тут будет помощь: " + msg.text);
            break;
          case '/links' || "/links@UB_TBot":
            bot_sendMessage(chatId, "Тут будут ссылки: " + msg.text);
            break;
          case '/quote' || "/quote@UB_TBot":
            bot_sendMessage(chatId, "Тут будет цитата: " + msg.text);
            break;
          case '/':
            bot_sendMessage(chatId, 'Выберите команду или напишите что искать после знака: "<strong>*</strong>"');
            break;
          default:
            bot_sendMessage(chatId, "Не знаю такой комманды: " + msg.text);
        }
      }

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
            bot_sendMessageKeyboard(chatId, message, INKEY_FIND);
          } else {
            for (var i = 0; i < 5 && i < arrayFindWords.length; i++) {
              message = i + 1 + '\n' + arrayFindWords[i].replace(matches[1], '<code>' + matches[1] + '</code>') + '\n\n';
              bot_sendMessage(chatId, message);
            }
          }
        }
        else {
          message = ' <strong>' + 'Ничего не найдено по запросу: ' + '</strong> \n' + matches[1];
          bot_sendMessage(chatId, message);
        }
      }

      // ОБРАБАТЫВАЕМ ВСЕ ОСТАЛЬНЫЕ СООБЩЕНИЯ
      else {
        message = 'Выберите команду или напишите что искать после знака: "<strong>*</strong>"';
        bot_sendMessage(chatId, message);
      }
    }
  } catch (error) {
    Logger.log(error);
    bot_sendMessage(chatId, '<b>Ошибка:</b> ' + '<code>' + error + '</code>');
  }
}