'use strict';

import _item                              from './templates/page-list-item.jade';
import {logger}                           from '../../app/helpers';
import {Schedule, default as allSchedule} from '../../collections/schedule';
import days                               from '../../collections/days';
import {SimpleLink}                       from '../ui/list';
import {PullDown}                         from '../ui/page';

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

/** коллекция площадок для выбранной смены */
let selectedCollection;
let place, day;
class Page extends PullDown {
  get collection() {
    return allSchedule;
  }

  initialize({dayID = 0, placeID = 0} = {}) {
    super.initialize();

    day = dayID;
    place = placeID;

    this.$list = this.$el.find('.b-list');
  }

  addAll() {
    if (!day) {
      logger.info('не выбран день');
      return this;
    }
    let model = days.findWhere({id: day});
    setTitle(model);

    let schedule = this.collection.where({
      dayID: day,
      placeID: place,
      active: true
    });
    if (!schedule.length) {
      if (this.collection.status !== 'pending') {
        this.$empty.show();
      }

      logger.info('почему то пустое расписание');
      return this;
    }
    // модифицируем поле sort, пишем в него время старта
    let date = model.get('timestamp');
    schedule = schedule.map(model => {
      let params = model.toJSON();
      let start = params.start.replace(':', '');
      let sort = +start || 0;
      // микро хак, так как 00:00 = 24:00
      params.sort = sort > 0 ? sort : 2400;
      params.date = date;
      return params;
    });

    selectedCollection = new Schedule(schedule);
    let view = new List({
      collection: selectedCollection,
      href: function (model) {
        let id = model.get('id');
        return `schedule/detail.html?id=${id}`;
      }
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }

  addItem(model) {
    // если нет коллекции, то и не чего тут делать
    if (!selectedCollection) {
      return this;
    }

    if (day === model.get('dayID') && place === model.get('placeID')) {
      selectedCollection.set(model);
    }
  }
}

export default Page;
