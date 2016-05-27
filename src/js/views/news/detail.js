'use strict';

import _content from './templates/detail-content.jade';

class Page extends Backbone.View {
  get template() {
    return _.template(_content);
  }

  initialize() {
    this.$content = this.$el.find('.content-block-inner');
  }

  render() {
    this.$content.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

export default Page;
