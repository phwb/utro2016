'use strict';

import {logger} from '../../app/helpers';
import _detail  from './templates/detail-content.jade';
import schedule from '../../collections/schedule';
import days     from '../../collections/days';

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

let ajax = Backbone.ajax;

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
    let params = {
      url: 'http://api.utro2016.loc/',
      type: 'POST',
      data: {
        VOTE_ID: '1',
        vote: 'yes',
        PUBLIC_VOTE_ID: '1',
        vote_radio_1: '2',
        vote_radio_2: '3',
        userID: 'USER_FROM_APP'
      }
    };
    ajax(params)
      .done(function (data) {
        console.log(data);
      })
      .fail(function () {
        console.log(arguments);
      });
  }

  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть расписание, нужно передать айдишник');
    }

    let model = schedule.get(id);
    if (!model) {
      throw new Error(`на нашли расписание с таким айдишником ${id}`);
    }

    let day = days.get( model.get('dayID') );
    if (day) {
      setTitle(day);
    }

    this.$content = this.$el.find('.content-block-inner');
    this.model = model;
  }

  render() {
    if (!this.model) {
      return this;
    }
    this.$content.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

export default Page;
