'use strict';

import {logger}   from '../../app/helpers';
import _detail    from './templates/detail-content.jade';
import schedule   from '../../collections/schedule';
import days       from '../../collections/days';

function setTitle(model) {
  if (!model) {
    return false;
  }

  let $ = Backbone.$;
  let name = model.get('name');
  let timestamp = model.get('timestamp');
  let date = model.get('date');
  let $title = $('.schedule-detail-title');

  if (timestamp) {
    date = _.template.formatDate('dd Mm, D', new Date(timestamp * 1000));
  }

  $title.text(`${name}. ${date}`);
}

// Добавить в мое расписание
// Убрать из моего расписания
// .b-button_color_cancel

class Page extends Backbone.View {
  get template() {
    return _.template(_detail);
  }

  get events() {
    return {
      'click .b-button': 'toggleMySchedule'
    };
  }

  toggleMySchedule() {
    if (!this.model) {
      logger.error('исключительная ситуация, не найдена модель расписания');
      return this;
    }
    let my = this.model.toggle();
    this.$button[ my ? 'addClass' : 'removeClass' ]('b-button_color_cancel');
    this.$button.find('span').text(my ? 'Убрать из моего расписания' : 'Добавить в мое расписание');
  }

  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть расписание, нужно передать айдишник');
    }

    let model = schedule.get(id);
    if (!model) {
      throw new Error(`на нашли расписание с таким айдишником ${id}`);
    }
    this.model = model;

    let day = days.get( model.get('dayID') );
    if (day) {
      setTitle(day);
    }

    this.$content = this.$el.find('.content-block-inner');
  }

  render() {
    if (!this.model) {
      return this;
    }
    this.$content.html( this.template( this.model.toJSON() ) );
    this.$button = this.$el.find('.b-button');

    return this;
  }
}

export default Page;
