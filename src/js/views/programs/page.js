'use strict';

import Tabs       from './tabs';
import Subnavbar  from './subnavbar';

class Page extends Backbone.View {
  initialize() {
    this.$tabs = this.$el.find('.tabs');
  }

  render() {
    return this
      .renderTabs()
      .renderSubnavbar();
  }

  renderTabs() {
    let tabs = new Tabs({
      el: this.$tabs
    });
    tabs.render();
    return this;
  }

  renderSubnavbar() {
    let subnavbar = new Subnavbar();
    subnavbar.render();
    return this;
  }
}

export default Page;
