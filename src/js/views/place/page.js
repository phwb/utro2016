'use strict';

import {SimpleLink}                 from '../ui/list';
// шаблон
import _item                        from './templates/page-list-item.jade';
// коллецкия
import {Places, default as places}  from '../../collections/places';
import config                       from '../../models/config';

class List extends SimpleLink {
  get className() {
    return 'b-list__lst';
  }

  get Item() {
    class Item extends super.Item {
      get className() {
        return 'b-list__item';
      }

      get template() {
        return _.template(_item);
      }
    }
    return Item;
  }
}

class Page extends Backbone.View {
  get collection() {
    return places;
  }

  initialize() {
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.b-list');
  }

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
