'use strict';

import _item                            from '../schedule/templates/page-list-item.jade';
import {Select}                         from '../ui/input';
import {SimpleLink}                     from '../ui/list';
import config                           from '../../models/config';
import shifts                           from '../../collections/shifts';
import {default as schedule, Schedule}  from '../../collections/schedule';

class ShiftSelect extends Select {
  change(model) {
    let id = model.get('id');
    config.set({shiftID: id}).save();
  }
}

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

      initialize() {
        super.initialize();
        this.listenTo(this.model, 'change:my', this.removeItem);
      }

      removeItem() {
        this.remove();
      }
    }
    return Item;
  }
}

let $ = Backbone.$;
class Page extends Backbone.View {
  initialize({tab = ''} = {}) {
    this.$shiftSelect = this.$el.find('#shift-select');
    this.$list = this.$el.find('#cabinet-schedule .b-list');
    this.$el.find('.toolbar-calendar').addClass('is-active');

    if (tab === 'my') {
      $('#link-schedule')
        .addClass('active')
        .siblings()
        .removeClass('active');

      $('#cabinet-schedule')
        .addClass('active')
        .siblings()
        .removeClass('active');
    }
  }

  render() {
    return this
      .renderShiftSelect()
      .renderNotify()
      .renderMySchedule();
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
    // TODO по идее тут код который юзает плагин кордовы
    return this;
  }

  renderMySchedule() {
    let mySchedule = schedule.where({my: true});
    if (!mySchedule.length) {
      return this;
    }

    let list = new List({
      collection: new Schedule(mySchedule),
      href: function (model) {
        let id = model.get('id');
        return `schedule/detail.html?id=${id}`;
      }
    });

    this.$list.html( list.render().$el );
    return this;
  }
}

export default Page;
