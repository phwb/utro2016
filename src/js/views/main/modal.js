'use strict';

// шаблоны
import _item          from './templates/modal-list-item.jade';
import _logo          from './templates/modal-logo.jade';
// коллекции
import config         from '../../models/config';
import shifts         from '../../collections/shifts';
// UI
import {Simple, Item} from '../ui/list';

class ListItem extends Item {
  get tagName() {
    return 'a';
  }

  get className() {
    return 'b-section-list__item';
  }

  get attributes() {
    return {
      href: '#'
    };
  }

  get template() {
    return _.template(_item);
  }

  get events() {
    return {
      'click': 'setShift'
    };
  }

  setShift() {
    let id = this.model.get('id');
    config.set({shiftID: id}).save();
  }
}

class List extends Simple {
  get tagName() {
    return 'div';
  }

  get className() {
    return 'b-section-list';
  }

  get Item() {
    return ListItem;
  }
}

class Modal extends Backbone.View {
  get collection() {
    return shifts;
  }

  initialize() {
    this.$list = this.$el.find('.b-welcome-screen__close');
    this.$modal = this.$el.closest('.login-screen');

    // пробуем поискать в конфиге выбранну смену
    // если она есть, то мы просто скроем попап выбора смен
    let shiftID = config.get('shiftID');
    if (shiftID) {
      this.$modal.hide().removeClass('modal-in');
      return this;
    }

    // слушаем изменения конфига, чтобы закрыть окно
    this.listenTo(config, 'change:shiftID', this.hideModal);

    // к моменту инициализации этой вьюшки, смены уже загружены
    // это гарантирует промис в функции initSync
    this.addAll();
  }

  addAll() {
    let list = new List({
      collection: this.collection
    });

    this.$list.html( list.render().$el ).prepend(_logo);
  }

  hideModal() {
    this.$modal.trigger('close:modal');
  }
}

export default Modal;
