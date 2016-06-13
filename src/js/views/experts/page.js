'use strict';

import {logger}                       from '../../app/helpers';
import _item                          from './templates/page-list-item.jade';
import {Experts, default as experts}  from '../../collections/experts';
import places                         from '../../collections/places';
import {SimpleLink}                   from '../ui/list';
import {PullDown}                     from '../ui/page';

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

let emptyIcon = {
  federal: false,
  places: false
};

let selectedFederal;
let selectedPlaces;
class Page extends PullDown {
  get collection() {
    return experts;
  }

  initialize() {
    super.initialize();

    this.$federal = this.$el.find('#experts-federal .b-list');
    this.$places = this.$el.find('#experts-places .b-list');
  }

  addAll() {
    emptyIcon.federal = false;
    emptyIcon.places = false;

    this
      .addFederal()
      .addPlaces()
      .toggleEmptyIcon();
  }

  addFederal() {
    let experts = this.collection.where({
      placeID: 0,
      active: true
    });

    this.$federal.empty();
    if (!experts.length) {
      emptyIcon.federal = true;
      logger('не нашли ни одного федерального эксперта');
      return this;
    }

    selectedFederal = new Experts(experts);
    let view = new List({
      collection: selectedFederal,
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
      return model.get('placeID') !== 0 && model.get('active') === true;
    });

    this.$places.empty();
    if (!experts.length) {
      emptyIcon.places = true;
      logger('не нашли ни одного эксперта площадки');
      return this;
    }
    experts = experts.map(model => {
      let params = model.toJSON();
      params.placeName = places.get(params.placeID).get('shortName');
      return params;
    });

    selectedPlaces = new Experts(experts);
    let view = new List({
      collection: selectedPlaces,
      href: function (model) {
        let id = model.get('id');
        return `experts/detail.html?id=${id}`;
      }
    });

    this.$places.html( view.render().$el );
    return this;
  }

  toggleEmptyIcon() {
    let show = emptyIcon.federal && emptyIcon.places;
    this.$empty[ show ? 'show' : 'hide' ]();
  }

  addItem(model) {
    if (!selectedFederal || !selectedPlaces) {
      return this;
    }

    let placeID = model.get('placeID');
    if (placeID === 0) {
      selectedFederal.set(model);
    } else {
      selectedPlaces.set(model);
    }
  }
}

export default Page;
