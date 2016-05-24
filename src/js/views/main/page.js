'use strict';

import {logger} from '../../app/helpers';
// шаблоны
import _item                          from './templates/page-list-item.jade';
// коллецкии
import config                         from '../../models/config';
import {Places, default as allPlaces} from '../../collections/places';
// UI
import {SimpleLink}                   from '../ui/list';
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
    this.$pull = this.$el.find('.pull-to-refresh-content');
    this.$empty = this.$el.find('.empty-page');

    // событие происходят в функции initSync()
    // --------------
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    /*
     * TODO ТАК СДЕЛАТЬ НА КАЖДОЙ СТРАНИЦЕ:
     *
     * TODO переделать до обеда - подписаться на событие ajax.{start|end} и показывать скрывать прелоадер
     * TODO по умолчанию сделать страницу "Пустой список"
     */
    this.listenTo(collection, 'sync:ajax.start', this.loadStart);
    this.listenTo(collection, 'sync:ajax.end',   this.loadSuccess);
    this.listenTo(collection, 'sync:error',      this.loadError);

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

  loadStart() {
    this.$empty.hide();
    this.$pull.addClass('refreshing');
  }

  /**
   * функция аналогична addAll, добавлена исключительно для отладки событий
   */
  loadSuccess() {
    this.$pull.removeClass('refreshing');
    this.addAll();
  }

  loadError() {

  }

  addAll() {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      logger('Нужно выбрать смену');
      return this;
    }

    if (!this.collection.length) {
      logger('Площадки еще не загрузились');
      return this;
    }

    let places = this.collection.where({shiftID: shiftID}) || [];
    if (!places.length) {
      logger('какая-то исключительная ситуация, не найдены площадки для выбранной смены');
      return this;
    }

    this.$empty.hide();
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
