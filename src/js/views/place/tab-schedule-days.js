'use strict';

import {SimpleLink} from '../ui/list';
import {Days, default as allDays} from '../../collections/days';
import config from '../../models/config';

let place = 0;
class ScheduleDays extends Backbone.View {
  get collection() {
    return allDays;
  }

  initialize({placeID = 0} = {}) {
    place = placeID;
    this.listenTo(this.collection, 'change:shiftID', this.changeShift);
  }

  changeShift() {
    this.addAll();
  }

  addAll() {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      console.log('Нужно выбрать смену');
      return this;
    }

    if (!this.collection.length) {
      console.log('дни еще не загрузились');
      return this;
    }

    let days = this.collection.where({shiftID: shiftID}) || [];
    if (!days.length) {
      console.log('какая-то исключительная ситуация, не найдены дни для выбранной смены');
      return this;
    }

    let list = new SimpleLink({
      collection: new Days(days),
      href: function (model) {
        let day = model.get('id');
        return `schedule/index.html?day=${day}&place=${place}`;
      }
    });

    this.$el.html( list.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default ScheduleDays;
