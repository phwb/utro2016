'use strict';

import {logger}                       from '../../app/helpers';
import _item                          from './templates/page-list-item.jade';
import config                         from '../../models/config';
import {Places, default as allPlaces} from '../../collections/places';
import {SimpleLink}                   from '../ui/list';
import {PullDown}                     from '../ui/page';
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

/** коллекция площадок для выбранной смены */
let selectedCollection;
class Page extends PullDown {
  get collection() {
    return allPlaces;
  }

  initialize() {
    super.initialize();
    this.$list = this.$el.find('.b-main-teasers');

    // подписываемя на событие изменения конфига
    // может произойти когда пользователь долго смотрит на экран выбора площадки
    // а в этот момент события «reset» и «sync:ajax.end» уже произошли
    this.listenTo(config, 'change:shiftID', this.changeShift);
  }

  changeShift() {
    this.addAll();
  }

  addAll() {
    let collection = this.collection;
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      logger.info('нужно выбрать смену');
      return this;
    }

    if (!collection.length) {
      logger.info('площадки еще не загрузились');
      return this;
    }

    let places = collection.where({shiftID: shiftID}) || [];
    if (!places.length) {
      logger.error('какая-то исключительная ситуация, не найдены площадки для выбранной смены');
      return this;
    }

    selectedCollection = new Places(places);
    let list = new List({
      collection: selectedCollection,
      href: function (model) {
        let id = model.get('id');
        return `places/detail.html?id=${id}`;
      }
    });

    this.$empty.hide();
    this.$list.html( list.render().$el );
  }

  addItem(model) {
    // если нет коллекции, то и не чего тут делать
    if (!selectedCollection) {
      return this;
    }

    let shiftID = config.get('shiftID');
    if (!shiftID) {
      logger('addItem: нужно выбрать смену');
      return this;
    }
    if (shiftID === model.get('shiftID')) {
      selectedCollection.set(model);
    }
  }
}

export default Page;
