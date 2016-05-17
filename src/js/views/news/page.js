'use strict';

import {SimpleLink} from '../list/index';
// коллецкия
import news from '../../collections/news';

let _newsLink = `
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
        return _.template(_newsLink);
      }
    }
    return Item;
  }
}

class Page extends Backbone.View {
  initialize() {
    let collection = this.collection = news;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$list = this.$el.find('.list-block');
    if (collection.length) {
      this.addAll();
    }
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
