'use strict';

import _simple  from './templates/simple.jade';
import _link    from './templates/simple-link.jade';

class Item extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get template() {
    return _.template(_simple);
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

// обычный список
class Simple extends Backbone.View {
  get tagName() {
    return 'ul';
  }

  get Item() {
    return Item;
  }

  addItem(model) {
    let item = new this.Item({model: model});
    this.$el.append( item.render().$el );
  }

  render() {
    this.$el.empty();
    this.collection.each(this.addItem, this);
    return this;
  }
}

function defaultHref(model) {
  let id = model.get('id');
  return `#${id}`;
}

// список со ссылками
class SimpleLink extends Simple {
  initialize({href = defaultHref} = {}) {
    this.href = href;
  }

  get Item() {
    let self = this;
    return class extends Item {
      get template() {
        return _.template(_link);
      }

      render() {
        let params = this.model.toJSON();
        params.href = self.href(this.model);
        this.$el.html( this.template( params ) );
        return this;
      }
    };
  }
}

export {Item, Simple, SimpleLink};