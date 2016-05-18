'use strict';

import {SimpleLink} from '../ui/list';
import config from '../../models/config';
import allDays from '../../collections/days';
import {Schedule ,default as schedule} from '../../collections/schedule';

console.log(schedule);

let $ = Backbone.$;


class Tab extends Backbone.View {
  get collection() {
    return schedule;
  }

  get className() {
    return 'page-content tab';
  }

  initialize() {
    this.listenTo(this.model, 'active', this.setSelected);
    this.$list = $('<div class="list-block" />').text('Пусто').appendTo(this.$el);
  }

  setSelected() {
    this.$el.addClass('active');
  }

  render() {
    let {id} = this.model.toJSON();

    this.$el.attr('id', `day-${id}`);

    let schedule = this.collection.where({
      dayID: id,
      placeID: 'empty'
    });
    if (!schedule.length) {
      return this;
    }

    schedule = schedule.map(model => {
      let name = model.get('name') + ', ' + model.get('start');
      return {
        id: model.get('id'),
        name: name
      };
    });

    let list = new SimpleLink({
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
