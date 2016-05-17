'use strict';

import {initRouter, initSync, formatDate} from './app/helpers';

// первичная настройки подключения к БД
let lf = Backbone.localforage.localforageInstance;
lf.config({
  name: 'utro2016'
});

// функция форматирования даты
_.template.formatDate = formatDate;

// инициализация роутера
initRouter();

// установка начальных параметров Framework7
// --------------
// при чем инициализация в самом низу скрипта в функции initSync,
// это гарантирует загрузку некоторых коллекций до старта приложения
let app = new Framework7({
  swipePanel: 'left',
  animateNavBackIcon: true,
  init: false
});

// создаем главную (и единственную) вьюшку приложения
app.addView('.view-main', {
  dynamicNavbar: true
});

// начало синхронизации
initSync(function () {
  let $ = Backbone.$;

  // закрываем модальное окно при выборе смены
  // событие генерится вьюшке views/main/modal
  $('.login-screen').on('close:modal', function () {
    app.closeModal();
  });

  // где то по пути инициализируем само приложение
  app.init();
});
