'use strict';

import polls            from '../../collections/polls';
import {getPollFields}  from '../../app/sync';

class Page extends Backbone.View {
  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть опрос, нужно передать айдишник');
    }

    let model = polls.get(id);
    if (!model) {
      throw new Error(`на нашли опрос с таким айдишником ${id}`);
    }
    
    this.$empty = this.$el.find('.empty-page');
    this.$content = this.$el.find('.content-block-inner');
    this.model = model;
  }

  render() {
    if (!this.model) {
      return this;
    }

    let voted = this.model.get('voted');
    this[ voted ? '_renderResult' : '_renderForm' ]();

    return this;
  }

  _renderResult() {

  }

  _renderForm() {
    getPollFields(this.model)
      .then(function (data) {
        console.log(data);
      })
      .catch(function () {
        console.log(arguments);
      });
  }
}

export default Page;
