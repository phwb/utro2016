'use strict';

import Router from './app/router';
// import Page from './app/page';
import loader from './app/loader';

let router = new (Router.extend({
  routes: {
    'places':       'placesList',
    'places/:id':   'placesDetail'
  }
}))();

let app = new Framework7({
  ajaxLink: 'ajax'
});

let view = app.addView('.view-main', {
  dynamicNavbar: true
});

router.on('route:placesList', function () {
  loader('places').then(function (page) {
    view.router.loadContent(page.render());
  });
  /*let page = new Page({
    name: 'places',
    title: 'Площадки'
  });
  view.router.loadContent(page.render());*/
});

