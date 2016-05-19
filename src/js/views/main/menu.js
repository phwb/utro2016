'use strict';

import items from './menu.json';
import {SimpleLink} from '../ui/list';

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

let _item ='<a href="<%= href %>" class="item-link close-panel b-main-nav__act"><%= name %></a>';
class MenuLink extends SimpleLink {
  get className() {
    return 'b-main-nav__lst';
  }

  get Item() {
    class Item extends super.Item {
      get className() {
        return 'b-main-nav__item';
      }

      get template() {
        return _.template(_item);
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
    this.$content = this.$el.find('.b-main-nav');
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
