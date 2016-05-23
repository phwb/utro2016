'use strict';

import _item                            from './templates/page-list-item.jade';
import {SimpleLink}                     from '../ui/list';
import config                           from '../../models/config';
import allDays                          from '../../collections/days';
import {Schedule ,default as schedule}  from '../../collections/schedule';

let $ = Backbone.$;

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

class Tab extends Backbone.View {
  get collection() {
    return schedule;
  }

  get className() {
    return 'tab b-tabs__item';
  }

  initialize() {
    this.listenTo(this.model, 'active', this.setSelected);
    this.$list = $('<div class="b-list" />').text('Пусто').appendTo(this.$el);
  }

  setSelected() {
    this.$el.addClass('active');
  }

  render() {
    let {id} = this.model.toJSON();

    this.$el.attr('id', `day-${id}`);

    let schedule = this.collection.where({
      dayID: id,
      placeID: 0
    });
    if (!schedule.length) {
      return this;
    }

    let cache = {};
    schedule = schedule.map(model => {
      let params = model.toJSON();

      if (!cache[params.dayID]) {
        let day = allDays.get(params.dayID);
        let ts = day.get('timestamp');
        cache[params.dayID] = ts ? _.template.formatDate('dd Mm', new Date(ts * 1000)) : day.get('date');
      }
      params.date = cache[params.dayID];

      return params;
    });

    let list = new List({
      collection: new Schedule(schedule),
      href: function (model) {
        let id = model.get('id');
        return `schedule/detail.html?id=${id}`;
      }
    });
    this.$list.html( list.render().$el );

    return this;
  }
}

class Tabs extends Backbone.View {
  get collection() {
    return allDays;
  }

  render() {
    this.addAll();
    return this;
  }

  addAll() {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      console.log('Нужно выбрать смену');
      return this;
    }

    let collection = this.collection;
    if (!collection.length) {
      console.log('Дни еще не загрузились');
      return this;
    }

    let days = collection.where({shiftID: shiftID}) || [];
    if (!days.length) {
      console.log('какая-то исключительная ситуация, не найдены дни для выбранной смены');
      return this;
    }

    days.forEach(this.addItem, this);
  }

  addItem(model) {
    let tab = new Tab({model: model});
    this.$el.append( tab.render().$el );
  }
}

export default Tabs;
