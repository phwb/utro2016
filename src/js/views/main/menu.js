'use strict';

import items from './menu.json';
import {SimpleLink} from '../list/index';

class MenuItem extends Backbone.Model {
  get defaults() {
    return {
      name: '',
      code: ''
    };
  }
}

class Menu extends Backbone.Collection {
  get model() {
    return MenuItem;
  }
}

class Panel extends Backbone.View {
  get el() {
    return '.panel-left';
  }

  initialize() {
    this.$content = this.$el.find('.content-block');
  }

  render() {
    let view = new SimpleLink({
      collection: this.collection,
      href: function (model) {
        return model.get('code');
      }
    });
    this.$content.html( view.render().$el );
    return this;
  }
}

let menu = new Menu(items);
let panel = new Panel({
  collection: menu
});
panel.render();
