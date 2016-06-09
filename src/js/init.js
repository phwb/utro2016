/* переменная webpack */
/* global IS_DEV */

'use strict';

/**
 * коротко о приложении
 *
 * структура папок:
 *  ./app             - папка с вспомогательными функциями (сихронизация, дата и так далее)
 *  ./collections     - папка сописанием коллекций приложения
 *  ./controllers     - папка с контроллерами, роутинг инициализируется в функции initSync
 *  ./models          - папка с описанием моделей
 *  ./views           - папка с вьюшками
 *
 * работа роутера приложения подробно описана тут:
 *  http://framework7.io/tutorials/mobile-mvc-apps-with-framework7-requirejs-and-handlerbars.html
 *
 * если коротко, то:
 * при клике на ссылку Framework7 загружает аяксом страницу, пасрит ее и вставляем в DOM
 * при этом генерирует кучу событий, таких как:
 *  PageBeforeInit, PageInit, PageBeforeAnimation, PageAfterAnimation, PageBeforeRemove
 *
 * в данном случае используеся событие pageBeforeInit, событие генерирует объект в котором описана загруженная
 * страница, в объекте есть вся необходимая информация
 *
 * для работы приложения нам необходимо знать имя страницы и ее параметры (параметры тоже передает Framework7)
 * далее, зная имя страницы и ее параметры, мы прсто подключам нужный нам контроллер, в котором генерируется вьюшка
 *
 * ./views/main/menu.js   - левая панель приложения
 * ./views/main/menu.json - объект из которого строится меню
 */

import {initRouter, initSync, formatDate, initPushwoosh, initStatusBar} from './app/helpers';

// первичная настройки подключения к БД
// --------------
// UPDATE 30.05.2016 - изменил место хранения БД на localStorage,
// потому что в WebSQL и IndexedDB сохраняется очень долго
let lf = Backbone.localforage.localforageInstance;
lf.config({
  driver: [lf.LOCALSTORAGE, lf.INDEXEDDB, lf.WEBSQL],
  name: 'utro2016'
});

// функция форматирования даты
_.template.formatDate = formatDate;

// установка начальных параметров Framework7
// --------------
// при чем инициализация в самом низу скрипта в функции initSync,
// это гарантирует загрузку некоторых коллекций до старта приложения
let app = new Framework7({
  swipePanel: 'left',
  animateNavBackIcon: true,
  init: false
});

// инициализация роутера
initRouter(app);

// создаем главную (и единственную) вьюшку приложения
let mainView = app.addView('.view-main', {
  dynamicNavbar: true
});

// коллбек функция для initSync
function initSyncCallback() {
  let $ = Backbone.$;

  document.addEventListener('backbutton', e => {
    e.preventDefault();
    mainView.router.back();
  });

  // подписываемся на событие окончания загрузки
  // сделано для того чтобы не пробрасывать app во вьюшки
  // --------------
  // собственно как и событие закрытия модального окна
  $(document).on('refreshend', '.pull-to-refresh-content', () => app.pullToRefreshDone());

  // закрываем модальное окно при выборе "смены"
  // событие генерируется вьюшке views/main/modal
  $('.login-screen').on('close:modal', () => app.closeModal());

  initPushwoosh();
  initStatusBar();

  // где то по пути инициализируем само приложение
  app.init();
}
// начало синхронизации
document.addEventListener(IS_DEV ? 'DOMContentLoaded' : 'deviceready', initSync.bind(false, initSyncCallback), false);
