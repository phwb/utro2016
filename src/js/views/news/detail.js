'use strict';

import news from '../../collections/news';
import detail from './detail.jade';

let template = _.template(detail);
let cache = {};

class Detail extends Backbone.View {
  render() {
    this.$el.html( template( this.model.toJSON() ) );
    return this;
  }
}

export default function (id) {
  return new Promise((resolve, reject) => {
    let model = news.get(id);

    if (!model) {
      reject();
    }

    if (!cache[id]) {
      cache[id] = new Detail({
        model: model
      });
    }

    resolve(cache[id]);
  });
}
