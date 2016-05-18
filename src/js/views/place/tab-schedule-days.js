'use strict';

import {SimpleLink} from '../ui/list';
import {Days, default as allDays} from '../../collections/days';
import config from '../../models/config';

let days = allDays.where({shiftID: config.get('shiftID')});
let daysCollection = new Days(days);

// дописать событие изменения смены
class ScheduleDays extends SimpleLink {
  initialize({placeID = 0} = {}) {
    this.href = function (model) {
      let dayID = model.get('id');
      return `schedule/index.html?day=${dayID}&place=${placeID}`;
    };
  }

  get collection() {
    return daysCollection;
  }
}

export default ScheduleDays;
