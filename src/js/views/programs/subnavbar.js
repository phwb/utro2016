'use strict';

import config from '../../models/config';
import allDays from '../../collections/days';

const elemID = '#days';

class TabItem extends Backbone.View {
  get tagName() {
    return 'a';
  }

  get className() {
    return 'button tab-link';
  }

  get attributes() {
    return {
      href: '#'
    };
  }

  render(active) {
    let params = this.model.toJSON();

    this.$el
      .text(params.name)
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
      console.log('Нужно выбрать смену');
      return this;
    }

    if (!this.collection.length) {
      console.log('Дни еще не загрузились');
      return this;
    }

    let days = this.collection.where({shiftID: shiftID}) || [];
    if (!days.length) {
      console.log('какая-то исключительная ситуация, не найдены дни для выбранной смены');
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
