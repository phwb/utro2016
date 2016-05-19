'use strict';

import config                         from '../../models/config';
import {Places, default as allPlaces} from '../../collections/places';
import {SimpleLink}                   from '../ui/list';
import _item                          from './templates/page-list-item.jade';
// меню приложения
import './menu';

class List extends SimpleLink {
  get className() {
    return 'b-main-teasers__lst';
  }

  get Item() {
    class Item extends super.Item {
      get template() {
        return _.template(_item);
      }

      get className() {
        return 'b-main-teasers__item';
      }
    }
    return Item;
  }
}

class Page extends Backbone.View {
  get collection() {
    return allPlaces;
  }

  initialize() {
    this.$list = this.$el.find('.b-main-teasers');
    console.log(this.$list);
    this.$pull = this.$el.find('.pull-to-refresh-content');

    // событие происходят в функции initSync()
    // --------------
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    // так же подписываемя на событие изменения конфига
    // --------------
    // может произойти когда пользователь долго смотрит на экран выбора площадки
    // а в этот момент события «reset» и «sync:ajax.end» уже произошли
    this.listenTo(config, 'change:shiftID', this.changeShift);
  }

  // события pull to refresh
  get events() {
    return {
      'refresh .pull-to-refresh-content': 'refreshStart',
      'refreshdone .pull-to-refresh-content': 'refreshDone'
    };
  }

  refreshStart() {
    // после завершения операвции обновления нужно вызвать триггер  "refreshend"
    this.collection.refresh().then(() => this.$pull.trigger('refreshend'));
  }

  refreshDone() {
    this.addAll();
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
    let list = new List({
      collection: new Places(places),
      href: function (model) {
        let id = model.get('id');
        return `places/detail.html?id=${id}`;
      }
    });

    this.$list.html( list.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Page;
