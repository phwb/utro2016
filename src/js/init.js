'use strict';

// классы
import Router from './app/router/index';
import Page from './app/page/index';
// статичные функции
import {loader, initSync} from './app/helpers/index';

// первичная настройки подключения к БД
let lf = Backbone.localforage.localforageInstance;
lf.config({
  name: 'utro2016'
});

// временная функция форматирования даты
// можно подключить moment.js или оставить так как есть
let leadingZero = i => i < 10 ? '0' + i : i;
let month = 'января февраля марта апреля мая июня июля августа сентября октября ноября декабря'.split(' ');
_.template.formatDate = stamp => {
  let date = new Date(stamp);
  let fragments = [
    date.getDate(),
    month[date.getMonth()],
    date.getFullYear()
  ];
  return fragments.join(' ') + ', ' + leadingZero(date.getHours()) + ':' + leadingZero(date.getMinutes());
};

// установка начальных параметров Framework7
// при чем инициализация в самом низу скрипта
let app = new Framework7({
  ajaxLink: 'ajax',
  init: false
});

// создаем главную (и единственную) вьюшку приложения
let view = app.addView('.view-main', {
  dynamicNavbar: true
});

// роутер всего приложения (слегка видоизменен стандартный роутер Backbone'на)
// срабатывает на ссылках (любых тегах) с классом .page-link и атрибутом href или data-href
let AppRouter = Router.extend({
  routes: {
    'main':                     'main',
    'schedule/:dayID/:placeID': 'schedule',
    ':route/:id':               'default',
    ':route':                   'default'
  }
});
let router = new AppRouter();

// расписание
router.on('route:schedule', function (dayID, placeID) {
  console.log('dayID = ' + dayID, ', placeID = ' + placeID);
});

// роут по умолчанию
router.on('route:default', function (name, id = 0) {
  // загружаем страницу
  loader(name)
    // отрисовываем и вставляем в DOM
    .then(function (factory) {
      let params = {
        id: id
      };

      let result = factory(view, Page, params);
      if (result === false) {
        // тут пока используется алерт из Framework7
        // TODO: в продакшен нужно переделать на нативный
        app.alert('Произошла не предвиденная ошибка, поторите действие еще раз!', 'Ошибка');
      }
    })
    // если что то пошло не так покажем 404-ую
    .catch(function () {
      let page404 = new Page({
        name: 'page-404',
        title: 'Страница не найдена'
      });
      view.loadContent(page404.render());
    });
});

// роут индексной страницы
router.on('route:main', e => loader('main').then(factory => factory(e.container)));

// загрузка индексной страницы
app.onPageBeforeInit('main', e => router.trigger('route:main', e));
// инициализация приложения
app.init();
// запускаем синхронизацию
initSync();
