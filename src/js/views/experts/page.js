'use strict';

import {logger}                       from '../../app/helpers';
import _item                          from './templates/page-list-item.jade';
import {SimpleLink}                   from '../ui/list';
// коллецкия
import {Experts, default as experts}  from '../../collections/experts';
import places                         from '../../collections/places';

class List extends SimpleLink {
  get className() {
    return 'b-list__lst';
  }
  get Item() {
    class Item extends super.Item {
      get className() {
        return 'b-list__item';
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
    return experts;
  }

  initialize() {
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.end', this.loadSuccess);

    this.$federal = this.$el.find('#experts-federal .b-list');
    this.$places = this.$el.find('#experts-places .b-list');
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
    let experts = this.collection.where({placeID: 0});
    if (!experts.length) {
      logger('не нашли ни одного федерального эксперта');
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
      return model.get('placeID') !== 0;
    });
    if (!experts.length) {
      logger('не нашли ни одного эксперта площадки');
      return this;
    }
    experts = experts.map(model => {
      let params = model.toJSON();
      params.placeName = places.get(params.placeID).get('shortName');
      return params;
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
