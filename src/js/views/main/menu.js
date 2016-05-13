'use strict';

import _item  from './templates/menu-item.jade';
import Menu   from '../../collections/menu';
import config from './menu-config';

let menu = new Menu(config);

class Item extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get template() {
    return _.template(_item);
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

class List extends Backbone.View {
  get tagName() {
    return 'ul';
  }

  addItem(model) {
    let view = new Item({model: model});
    this.$el.append(view.render().$el);
  }

  render() {
    menu.each(this.addItem, this);
    return this;
  }
}
let list = new List();

class Panel extends Backbone.View {
  get el() {
    return '.panel-left';
  }

  initialize() {
    this.$content = this.$el.find('.content-block');
  }

  render() {
    this.$content.html( list.render().$el );
    return this;
  }
}

export default Panel;
