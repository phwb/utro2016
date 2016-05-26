'use strict';

import _content from './templates/detail-content.jade';
import news     from '../../collections/news';

class Page extends Backbone.View {
  get template() {
    return _.template(_content);
  }

  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть новость, нужно передать айдишник');
    }

    let model = news.get(id);
    if (!model) {
      throw new Error(`на нашли новость с таким айдишником ${id}`);
    }

    this.$content = this.$el.find('.content-block-inner');
    this.model = model;
  }

  render() {
    if (!this.model) {
      return this;
    }
    this.$content.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

export default Page;
