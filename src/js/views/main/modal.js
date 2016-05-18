'use strict';

import config   from '../../models/config';
import shifts   from '../../collections/shifts';
import {Simple} from '../ui/list';

class Modal extends Backbone.View {
  initialize() {
    this.$list = this.$el.find('.list-block');
    this.$modal = this.$el.closest('.login-screen');

    // пробуем поискать в конфиге выбранну смену
    // если она есть, то мы просто скроем попап выбора смен
    let shiftID = config.get('shiftID');
    if (shiftID) {
      this.$modal.hide().removeClass('modal-in');
      return this;
    }

    // к моменту инициализации этой вьюшки, смены уже загружены
    // это гарантирует промис в функции initSync
    this.addAll(shifts);
  }

  addAll(collection) {
    let list = new Simple({
      collection: collection
    });

    this.$list.html( list.render().$el );
  }

  get events() {
    return {
      'click .item-content': 'setShift'
    };
  }

  setShift(e) {
    let id = e.currentTarget.dataset.id;

    e.preventDefault();
    if (id) {
      config.set({shiftID: id}).save();
      this.$modal.trigger('close:modal');
    }
  }
}

export default Modal;
