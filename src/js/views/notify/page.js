'use strict';

import _item      from './templates/page-list-item.jade';
import {PullDown} from '../ui/page';
import {Simple}   from '../ui/list';

class List extends Simple {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'b-msg';
  }

  get Item() {
    class Item extends super.Item {
      get tagName() {
        return 'div';
      }

      get className() {
        return 'b-msg__item';
      }

      get template() {
        return _.template(_item);
      }

      get events() {
        return {
          'click': 'viewed'
        };
      }

      viewed() {
        if (!this.model.get('isNew')) {
          return this;
        }
        this.model.viewed();
      }

      afterRender() {
        let isNew = this.model.get('isNew');
        this.$el[ isNew ? 'addClass' : 'removeClass' ]('b-msg__item_important');
      }
    }
    return Item;
  }
}

let $ = Backbone.$;
class Page extends PullDown {
  initialize() {
    super.initialize();
    this.$content = this.$el.find('.content-block-inner');
    this.$el.find('.toolbar-notify').addClass('is-active');

    $('#viewed').click(this.setAllAsViewed.bind(this));
  }

  setAllAsViewed() {
    this.collection.viewed();
  }

  addAll() {
    let collection = this.collection;
    let notify = collection.where({
      active: true
    });

    this.$content.empty();
    if (!notify.length) {
      if (collection.status && collection.status !== 'pending') {
        this.$empty.show();
      }
      return this;
    }

    let list = new List({
      el: this.$list,
      collection: notify
    });

    this.$empty.hide();
    this.$content.html( list.render().$el );
  }

  addItem(model) {
    this.collection.set(model, {remove: false});
  }
}

export default Page;
