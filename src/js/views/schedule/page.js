'use strict';

import {SimpleLink} from '../list/index';
import {Schedule, default as allSchedule} from '../../collections/schedule';

class List extends SimpleLink {
  initialize() {
    this.href = function (model) {
      let id = model.get('id');
      return `schedule/detail.html?id=${id}`;
    };
  }
}

class Page extends Backbone.View {
  initialize({day, place = 0} = {}) {
    this.dayID = day;
    this.placeID = place;

    let collection = this.collection = allSchedule;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.list-block');
    if (collection.length) {
      this.addAll();
    }
  }

  loadSuccess() {
    this.addAll();
  }

  addAll() {
    if (!this.dayID) {
      console.log('не выбран день');
    }

    let schedule = this.collection.where({
      dayID: this.dayID,
      placeID: this.placeID
    });
    schedule = schedule.map(model => {
      let name = model.get('name') + ', ' + model.get('start');
      return {
        id: model.get('id'),
        name: name
      };
    });
    let collection = new Schedule(schedule);

    let view = new List({
      collection: collection
    });

    this.$list.html( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}


export default Page;
