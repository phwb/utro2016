'use strict';

import shifts from '../../collections/shifts';
import _list  from './templates/modal-list.jade';
import _item  from './templates/modal-list-item.jade';

class Item extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get template() {
    return _.template(_item);
  }

  get events() {
    return {
      'change input': 'setShift'
    };
  }

  setShift() {
    let selected = this.model.collection.find({selected: true});
    if (selected) {
      selected.set({selected: false}, {silent: true});
    }
    this.model.set({selected: true}).save();
  }

  render() {
    this.$el.html( this.template( this.model.toJSON()) );
    return this;
  }
}

class List extends Backbone.View {
  get el() {
    return _list;
  }

  initialize () {
    this.$list = this.$el.find('ul');
  }

  addItem(model) {
    let view = new Item({
      model: model
    });
    this.$list.append( view.render().$el );
  }

  render() {
    this.collection.each(this.addItem, this);
    return this;
  }
}

// модальное окно с выбором площадки, при старте приложения
class Modal extends Backbone.View {
  get el() {
    return '.login-screen';
  }

  initialize() {
    this.$content = this.$el.find('.page-content');
    this.listenTo(shifts, 'change:selected', this.close);
    this.listenTo(shifts, 'sync:db', this.checkShift);
    this.listenTo(shifts, 'sync:ajax.end', this.checkShift);
  }

  close() {
    this.$el.hide();
  }

  checkShift(collection) {
    let shift = collection.findWhere({selected: true});

    if (!shift) {
      let list = new List({
        collection: collection
      });
      this.$content.html( list.render().$el );
      return this;
    }

    this.close();
  }
}

export default Modal;
