'use strict';

import {logger} from '../../app/helpers';
import _item    from './templates/subnavbar-item.jade';
import config   from '../../models/config';
import allDays  from '../../collections/days';

const elemID = '#days';

class TabItem extends Backbone.View {
  get tagName() {
    return 'a';
  }

  get className() {
    return 'tab-link b-tab-nav__item';
  }

  get attributes() {
    return {
      href: '#',
      style: 'white-space: nowrap; padding: 0 15px;'
    };
  }

  get template() {
    return _.template(_item);
  }

  render(active) {
    let params = this.model.toJSON();

    this.$el
      .html( this.template( params ) )
      .attr('href', `#day-${params.id}`);

    if (active) {
      this.$el.addClass('active');
      this.model.trigger('active');
    }

    return this;
  }
}

class Subnavbar extends Backbone.View {
  get el() {
    return elemID;
  }

  get collection() {
    return allDays;
  }

  render() {
    this.$el.empty();
    this.addAll();
    return this;
  }

  addAll() {
    let shiftID = config.get('shiftID');
    if (!shiftID) {
      logger('Нужно выбрать смену');
      return this;
    }

    if (!this.collection.length) {
      logger('Дни еще не загрузились');
      return this;
    }

    let days = this.collection.where({shiftID: shiftID}) || [];
    if (!days.length) {
      logger('какая-то исключительная ситуация, не найдены дни для выбранной смены');
      return this;
    }

    days.forEach(this.addItem, this);
  }

  addItem(model, index) {
    let view = new TabItem({model: model});
    this.$el.append( view.render(index === 0).$el );
  }
}

export default Subnavbar;
