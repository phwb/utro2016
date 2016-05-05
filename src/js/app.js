'use strict';

import Router from './app/router';
import Page from './app/page';
import load from './app/loader';

// установка начальных пврвметров Framework7
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
// срабатывает на ссылках (любых тегах) с классом .page-link
let router = new (Router.extend({
  routes: {
    'main':       'main',
    ':route/:id': 'default',
    ':route':     'default'
  }
}))();

// роут по умолчанию
router.on('route:default', function (name, id = 0) {
  load(name)
    .then(function (factory) {
      let params = {
        id: id
      };

      factory(view, Page, params);
    })
    .catch(function () {
      let page404 = new Page({
        name: 'page-404',
        title: 'Страница не найдена'
      });
      view.loadContent(page404.render());
    });
});

// роут индексной страницы
router.on('route:main', e => load('main').then(factory => factory(e.container)));

// загрузка индексной страницы
app.onPageBeforeInit('main', e => router.trigger('route:main', e));
// инициализация приложения
app.init();
