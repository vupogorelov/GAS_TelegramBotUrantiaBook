
//Постоянная основная клавиатура
const KEY_MAIN = {
  "keyboard": [
    [{"text": "Помощ" , 'callback_data': 'showHelp'},
     {"text": "Цитата", 'callback_data': 'showQuote'},
     {"text": "Ссылки", 'callback_data': 'showLinks'}
    ]
  ],
  "resize_keyboard": true,
  "one_time_keyboard": true
}

//Пристроенная клавиатура к результатам поиска
var INKEY_FIND = {
  "inline_keyboard": [
    [{"text": "Ещё"    , 'callback_data': 'showMore'},
     {"text": "Разбить", 'callback_data': 'showMulti'}
    ]
  ]
}

var KEY_DELETE = {
  "remove_keyboard": true
}

//=================================================================  файл Keyboard начало
var _KEYBOARD = {
  "keyboard": [
    [{"text": "Отправте Локацию",
      "request_location": true
     }]
  ],
  "one_time_keyboard": true,
  "resize_keyboard": true
}

var _KEYBOARD_1 = {
  "keyboard": [
    [{"text": "Привет"
     }]
  ],
  "resize_keyboard": true,
  "one_time_keyboard": true
}
var _KEY_DELETE = {
  "remove_keyboard": true
}

var _KEYBOARD_INLINE = {
  "inline_keyboard": [
    [{"text": "Привет",
      "callback_data": "Привет"
     }]
  ],
  "resize_keyboard": true
}
//файл Keyboard конец