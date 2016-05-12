'use strict';

// шаблоны
import _item        from './templates/contact-item.jade';
// коллекции
import allContacts  from '../../collections/contacts';

let $ = Backbone.$;

// элемент списка
class Item extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get template() {
    return _.template(_item);
  }

  render(placeID) {
    let params = _.extend({placeID: placeID}, this.model.toJSON());
    this.$el.html( this.template( params ) );
    return this;
  }
}

// вкладка Контакты
class Contacts extends Backbone.View {
  get className() {
    return 'list-block media-list';
  }

  initialize({placeID = 0} = {}) {
    this.$list = $('<ul />').appendTo(this.$el);
    let contacts = allContacts.where({placeID: placeID});

    if (contacts && contacts.length > 0) {
      contacts.forEach(this.addItem, this);
    }
  }

  addItem(model) {
    let view = new Item({model: model});
    this.$list.append( view.render( this.placeID ).$el );
  }
}

export default Contacts;
