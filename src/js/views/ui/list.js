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

  initialize() {
    this.listenTo(this.model, 'change', this.change);
  }

  change() {
    this.render();
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    this.afterRender();
    return this;
  }

  afterRender() {
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

  initialize() {
    this.listenTo(this.collection, 'add', this.addItem);
  }

  addItem(model) {
    let item = new this.Item({model: model});
    this.$el.append( item.render().$el );
  }

  render() {
    this.$el.empty();

    let method = 'forEach';
    if (this.collection instanceof Backbone.Collection) {
      method = 'each';
    }

    this.collection[method](this.addItem, this);
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
    super.initialize();
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
        this.afterRender();
        return this;
      }
    };
  }
}

export {Item, Simple, SimpleLink};
