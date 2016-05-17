'use strict';

import {SimpleLink} from '../list/index';
// коллецкия
import {Places, default as places} from '../../collections/places';
import config from '../../models/config';

class Page extends Backbone.View {
  initialize() {
    let collection = this.collection = places;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.list-block');
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
    let list = new SimpleLink({
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
