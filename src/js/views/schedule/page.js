'use strict';

import _item                              from './templates/page-list-item.jade';
import {logger}                           from '../../app/helpers';
import {SimpleLink}                       from '../ui/list';
import {Schedule, default as allSchedule} from '../../collections/schedule';
import days                               from '../../collections/days';

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

function setTitle(model) {
  if (!model) {
    return false;
  }

  let $ = Backbone.$;
  let name = model.get('name');
  let timestamp = model.get('timestamp');
  let date = model.get('date');
  let $title = $('.schedule-title');

  if (timestamp) {
    date = _.template.formatDate('dd Mm, D', new Date(timestamp * 1000));
  }

  $title.text(`${name}. ${date}`);
}

let place, day;
class Page extends Backbone.View {
  get collection() {
    return allSchedule;
  }

  initialize({dayID = 0, placeID = 0} = {}) {
    day = dayID;
    place = placeID;

    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.b-list');
  }

  loadSuccess() {
    this.addAll();
  }

  addAll() {
    if (!day) {
      logger('не выбран день');
    }
    let model = days.findWhere({id: day});
    setTitle(model);

    let schedule = this.collection.where({
      dayID: day,
      placeID: place
    });
    if (!schedule.length) {
      logger('почему то пустое расписание');
      return this;
    }

    let view = new List({
      collection: new Schedule(schedule),
      href: function (model) {
        let id = model.get('id');
        return `schedule/detail.html?id=${id}`;
      }
    });

    this.$list.html( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}


export default Page;
