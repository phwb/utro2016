'use strict';

import items from './menu.json';
import {SimpleLink} from '../list/index';

// модель... не стал выносисть в отедльный файл, так как по
// факту используется только тут
class MenuItem extends Backbone.Model {
  get defaults() {
    return {
      name: '',
      link: ''
    };
  }
}
// то же самое и для коллеккий
class Menu extends Backbone.Collection {
  get model() {
    return MenuItem;
  }
}

let _menuLink =`
<a href="<%= href %>" class="item-link close-panel">
  <div class="item-content">
    <div class="item-media"><i class="icon icon-f7"></i></div>
    <div class="item-inner">
      <div class="item-title"><%= name %></div>
    </div>
  </div>
</a>`;
class MenuLink extends SimpleLink {
  get Item() {
    class Item extends super.Item {
      get template() {
        return _.template(_menuLink);
      }
    }
    return Item;
  }
}

class Panel extends Backbone.View {
  get el() {
    return '.panel-left';
  }

  initialize() {
    this.$content = this.$el.find('.list-block');
  }

  render() {
    let view = new MenuLink({
      collection: this.collection,
      href: function (model) {
        return model.get('link');
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
