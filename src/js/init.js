'use strict';

// классы
import Router from './app/router/index';
import Page from './app/page/index';
// статичные функции
import {loader, initSync, formatDate} from './app/helpers/index';

// первичная настройки подключения к БД
let lf = Backbone.localforage.localforageInstance;
lf.config({
  name: 'utro2016'
});

// функция форматирования даты
_.template.formatDate = formatDate;

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
    // главная страница
    'main':                     'main',

    // расписание
    'schedule/:dayID/:placeID': 'schedule',
    'schedule/detail/:id':      'scheduleDetail',

    // дефолтный роут подходит под большинство страниц
    // все что находится выше, уже конкретные страницы
    ':route/:id':               'default',
    ':route':                   'default'
  }
});
let router = new AppRouter();

function loaderProxy(name, ...rest) {
  loader(name)
    // отрисовываем и вставляем в DOM
    .then(function (factory) {
      let params = {};
      for (let i = 0, len = rest.length; i < len; i += 1) {
        params['arg' + i] = rest[i];
      }

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
}

// расписание
router.on('route:scheduleDetail', id => loaderProxy('schedule-detail', id));
router.on('route:schedule', (dayID, placeID) => loaderProxy('schedule', dayID, placeID));
// роут по умолчанию
router.on('route:default', (name, id = 0) => loaderProxy(name, id));
// роут индексной страницы
router.on('route:main', e => loader('main').then(factory => factory(e.container)));

// загрузка индексной страницы
app.onPageBeforeInit('main', e => router.trigger('route:main', e));
// инициализация приложения
app.init();
// запускаем синхронизацию
initSync();
