'use strict';

import AboutItem from '../models/about-item';

let About = Backbone.Collection.extend({
  url: '/about',
  model: AboutItem,
  sync: Backbone.localforage.sync('about')
});

export {About};

export default new About();
