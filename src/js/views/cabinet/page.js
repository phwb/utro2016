'use strict';

import config from '../../models/config';
import shifts from '../../collections/shifts';

class Option extends Backbone.View {
  get tagName() {
    return 'option';
  }

  get events() {
    return {
      'selected': 'optionChangedHandler'
    };
  }

  optionChangedHandler() {
    this.model.trigger('selected', this.model);
  }

  render() {
    let params = this.model.toJSON();
    this.$el
      .text(params.name)
      .val(params.id);
    return this;
  }
}

class Select extends Backbone.View {
  tagName() {
    return 'select';
  }

  get events() {
    return {
      'change': 'changeHandler'
    };
  }

  changeHandler() {
    this.$el.find('option:selected').trigger('selected');
  }

  get Option() {
    return Option;
  }

  addItem(model) {
    let option = new this.Option({model: model});
    this.$el.append( option.render().$el );
  }

  render() {
    this.collection.each(this.addItem, this);
    return this;
  }
}

class ShiftSelect extends Select {
  initialize() {
    this.collection.on('selected', this.setShift, this);
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
