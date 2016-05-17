'use strict';

import {SimpleLink} from '../list/index';
// коллецкия
import {Experts, default as experts} from '../../collections/experts';

let _newsLink = `
<a href="<%= href %>" class="item-link item-content">
  <div class="item-media"><img src="<%= photo %>" width="80"></div>
  <div class="item-inner">
    <div class="item-title-row">
      <div class="item-title"><%= name %></div>
    </div>
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
    let collection = this.collection = experts;

    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$federal = this.$el.find('#experts-federal .list-block');
    this.$places = this.$el.find('#experts-places .list-block');
  }

  loadSuccess() {
    this.addAll();
  }

  addAll() {
    this
      .addFederal()
      .addPlaces();
  }

  addFederal() {
    let experts = this.collection.where({placeID: 'empty'});
    if (!experts.length) {
      console.log('не нашли ни одного федерального эксперта');
      return this;
    }
    
    let view = new List({
      collection: new Experts(experts),
      href: function (model) {
        let id = model.get('id');
        return `experts/detail.html?id=${id}`;
      }
    });

    this.$federal.html( view.render().$el );
    return this;
  }

  addPlaces() {
    let experts = this.collection.filter(model => {
      let placeID = model.get('placeID');
      return placeID !== 'empty';
    });

    let view = new List({
      collection: new Experts(experts),
      href: function (model) {
        let id = model.get('id');
        return `experts/detail.html?id=${id}`;
      }
    });

    this.$places.html( view.render().$el );
    return this;
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Page;
