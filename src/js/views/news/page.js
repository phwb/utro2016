'use strict';

import {SimpleLink} from '../ui/list';
// коллецкия
import news from '../../collections/news';

let _link = `
<a href="<%= href %>" class="item-link item-content">
  <div class="item-media"><img src="<%= previewPicture %>" width="80"></div>
  <div class="item-inner">
    <div class="item-title-row">
      <div class="item-title"><%= name %></div>
    </div>
    <div class="item-subtitle"><%= _.template.formatDate('dd Mm yyyy', new Date(date * 1000)) %></div>
    <% if (text) { %>
      <div class="item-text"><%- text %></div>
    <% } %>
  </div>
</a>
`;
class List extends SimpleLink {
  get Item() {
    class Item extends super.Item {
      get template() {
        return _.template(_link);
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
    console.log(this.$pull);

    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.list-block');
    if (collection.length) {
      this.addAll();
    }
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
