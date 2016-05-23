'use strict';

import _content from './templates/detail-content.jade';
import experts  from '../../collections/experts';
import places   from '../../collections/places';

function setTitle(federal = false) {
  let $ = Backbone.$;
  let $title = $('.expert-detail-title');
  $title.text(federal ? 'Федеральный эксперт' : 'Эксперт площадки');
}

class Page extends Backbone.View {
  get template() {
    return _.template(_content);
  }

  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть эксперта, нужно передать айдишник');
    }

    let model = experts.get(id);
    if (!model) {
      throw new Error(`на нашли эксперта с таким айдишником ${id}`);
    }

    this.$content = this.$el.find('.content-block-inner');
    this.model = model;
  }

  render() {
    if (!this.model) {
      return this;
    }

    let params = this.model.toJSON();

    if (params.placeID) {
      let place = places.get(params.placeID);
      params.placeName = place.get('shortName');
      params.placeHref = `places/detail.html?id=${place.get('id')}`;
    }

    setTitle(!params.placeID);
    this.$content.html( this.template( params ) );
    return this;
  }
}

export default Page;
