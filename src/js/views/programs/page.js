'use strict';

import ScheduleDays from '../place/tab-schedule-days';

class Page extends Backbone.View {
  initialize() {
    this.$content = this.$el.find('.content-block-inner');
  }

  render() {
    let view = new ScheduleDays({
      placeID: 0
    });
    this.$content.html( view.render().$el );
    return this;
  }
}

export default Page;
