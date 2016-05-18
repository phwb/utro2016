'use strict';

import {Select} from '../ui/input';
import config from '../../models/config';
import shifts from '../../collections/shifts';

class ShiftSelect extends Select {
  initialize() {
    this.listenTo(this.collection, 'selected', this.setShift);
  }

  setShift(model) {
    let id = model.get('id');
    config.set({shiftID: id}).save();
  }
}

class Page extends Backbone.View {
  initialize() {
    this.$shiftSelect = this.$el.find('#shift-select');
  }

  render() {
    return this
      .renderShiftSelect()
      .renderNotify();
  }

  renderShiftSelect() {
    let view = new ShiftSelect({
      collection: shifts
    });
    let elem = view.render().$el;
    let shiftID = config.get('shiftID');

    elem.val(shiftID);
    this.$shiftSelect.html( elem );
    return this;
  }

  renderNotify() {
    return this;
  }
}

export default Page;
