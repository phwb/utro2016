'use strict';

// шаблоны
import _navbar  from './templates/navbar.jade';
import _page    from './templates/detail-page.jade';
// коллекции
import schedule from '../../collections/schedule';

// навбар
class Navbar extends Backbone.View {
  get className() {
    return 'navbar';
  }

  get template() {
    return _.template(_navbar);
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

class Page extends Backbone.View {
  get className() {
    return 'pages';
  }

  get template() {
    return _.template(_page);
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

let cache = {};
function detailPage (id) {
  if (!id) {
    return false;
  }

  if (!cache[id]) {
    let model = schedule.get(id);

    if (!model) {
      return false;
    }

    cache[id] = {
      navbar: new Navbar({model: model}),
      page: new Page({model: model})
    };
  }

  return cache[id];
}

export default detailPage;
