'use strict';

import {SimpleLink} from '../ui/list';
// коллецкия
import news         from '../../collections/news';
// шаблон
import _item        from './templates/page-list-item.jade';

class List extends SimpleLink {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'b-news';
  }

  get Item() {
    class Item extends super.Item {
      get tagName() {
        return 'div';
      }

      get template() {
        return _.template(_item);
      }
    }
    return Item;
  }
}

class Page extends Backbone.View {
  get collection() {
    return news;
  }

  initialize() {
    this.$pull = this.$el.find('.pull-to-refresh-content');

    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.content-block-inner');
  }

  // события pull to refresh
  get events() {
    return {
      'refresh .pull-to-refresh-content': 'refreshStart',
      'refreshdone .pull-to-refresh-content': 'refreshDone'
    };
  }

  refreshStart() {
    // после завершения операвции обновления нужно вызвать триггер  "refreshend"
    this.collection.refresh().then(() => this.$pull.trigger('refreshend'));
  }

  refreshDone() {
    this.addAll();
  }

  loadSuccess() {
    this.addAll();
  }

  addAll() {
    let view = new List({
      collection: this.collection,
      href: function (model) {
        let id = model.get('id');
        return `news/detail.html?id=${id}`;
      }
    });

    this.$list.html( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Page;
