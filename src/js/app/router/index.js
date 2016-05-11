'use strict';

let $ = Backbone.$;

let defaultOptions = {
  className: '.page-link'
};

// Cached regex for stripping a leading hash/slash and trailing space.
let routeStripper = /^[#\/]|\s+$/g;

class History {
  constructor(params = {}) {
    this.handlers = [];
    let options = _.extend({}, defaultOptions, params);
    $(document).on('click', options.className, this.loadUrl.bind(this));
  }

  getHash() {
    let $el = this.$el;
    let href = $el.attr('href') || $el.data('href');
    let match = href.match(/#(.*)$/);
    return match ? match[1] : '';
  }

  getFragment() {
    let fragment = this.getHash();
    return fragment.replace(routeStripper, '');
  }

  loadUrl(e) {
    this.$el = $(e.currentTarget);
    let fragment = this.getFragment();
    e.preventDefault();
    return _.some(this.handlers, function(handler) {
      if (handler.route.test(fragment)) {
        handler.callback(fragment);
        return true;
      }
    });
  }

  route(route, callback) {
    this.handlers.push({route: route, callback: callback});
  }
}

let history = new History();

class Router extends Backbone.Router {
  route (route, name, callback) {
    if (!_.isRegExp(route)) {
      route = this._routeToRegExp(route);
    }
    if (_.isFunction(name)) {
      callback = name;
      name = '';
    }
    if (!callback) {
      callback = this[name];
    }
    let router = this;
    history.route(route, function(fragment) {
      let args = router._extractParameters(route, fragment);
      if (router.execute(callback, args, name) !== false) {
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
      }
    });
    return this;
  }
}

export default Router;
