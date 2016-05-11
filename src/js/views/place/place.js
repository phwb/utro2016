'use strict';

// шаблоны
import _navbar  from './templates/navbar.jade';
import _page    from './templates/page.jade';
// коллекции
import places   from '../../collections/places';

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

// локальный кэш вьюшек
let cache = {};
function placePage(id) {
  if (!id) {
    return false;
  }
  
  if (!cache[id]) {
    let place = places.get(id);

    if (!place) {
      return false;
    }

    cache[id] = {
      navbar: new Navbar({model: place}),
      page: new Page({model: place})
    };
  }

  return cache[id];
}

export default placePage;
