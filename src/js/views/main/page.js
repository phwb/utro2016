'use strict';

import config                         from '../../models/config';
import {Places, default as allPlaces} from '../../collections/places';
import {SimpleLink}                   from '../list/index';
// меню приложения
import './menu';

class List extends SimpleLink {
  initialize() {
    this.href = function (model) {
      let id = model.get('id');
      return `place.html?id=${id}`;
    };
  }
}

class Page extends Backbone.View {
  initialize() {
    this.$list = this.$el.find('.list-block');

    // событие происходят в функции initSync()
    // --------------
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    let collection = this.collection = allPlaces;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    // так же подписываемя на событие изменения конфига
    // --------------
    // может произойти когда пользователь долго смотрит на экран выбора площадки
    // а в этот момент события «reset» и «sync:ajax.end» уже произошли
    this.listenTo(config, 'change:shiftID', this.changeShift);
  }

  changeShift() {
    this.addAll();
  }

  /**
   * функция аналогична addAll, добавлена исключительно для отладки событий
   */
  loadSuccess() {
    this.addAll();
  }

  addAll() {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      console.log('Нужно выбрать смену');
      return this;
    }

    if (!this.collection.length) {
      console.log('Площадки еще не загрузились');
      return this;
    }

    let places = this.collection.where({shiftID: shiftID}) || [];
    if (!places.length) {
      console.log('какая-то исключительная ситуация, не найдены площадки для выбранной смены');
      return this;
    }

    // маленький хак, потом наверно придется переделать
    // для импорта массива в коллекцию
    let col = new Places(places);
    let list = new List({
      collection: col
    });

    this.$list.html( list.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Page;
