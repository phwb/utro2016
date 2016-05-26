'use strict';

import places       from '../../collections/places';
import ScheduleDays from './tab-schedule-days';
import ContactList  from './tab-contacts';

function setTitle(model) {
  let $ = Backbone.$;
  let name = model.get('shortName');
  let $title = $('.navbar-title');
  $title.text(`Урал ${name}`);
}

// сначала всегда полагаем что есть ошибки
let error = true;

class Page extends Backbone.View {
  initialize({id = false} = {}) {
    if (!id) {
      throw new Error('как то это странно, сюда попасть по идее не реально');
    }

    let model = places.get(id);
    if (!model) {
      throw new Error(`че то вообще странное творится, не найдена площадка ${id}`);
    }

    // если дошли до сюда, значит ошибок нет
    error = false;

    // кэшируем табы
    this.$desc = this.$el.find('#place-desc .b-tabs__content');
    this.$schedule = this.$el.find('#place-schedule .b-tabs__content');
    this.$contacts = this.$el.find('#place-contacts .b-tabs__content');
    // сохрнаим модель
    this.model = model;
    // установим заголово экрана
    setTitle(model);
  }

  render() {
    // если ошибка то она выведется в консоль выше
    if (error) {
      return this;
    }
    return this
      ._renderDescription()
      ._renderScheduleDays()
      ._renderContactList();
  }

  /**
   * рендер описания
   *
   * @private
   * @returns {Page}
   */
  _renderDescription() {
    let type = this.model.get('type');
    let text = this.model.get('text');
    this.$desc[type === 'html' ? 'html' : 'text'](text);
    return this;
  }

  /**
   * рендер расписания
   *
   * @private
   * @returns {Page}
   */
  _renderScheduleDays() {
    let schedule = new ScheduleDays({
      placeID: this.model.get('id')
    });
    this.$schedule.html( schedule.render().$el );
    return this;
  }

  /**
   * рендер контактов
   *
   * @private
   * @returns {Page}
   */
  _renderContactList() {
    let contacts = new ContactList({
      el: this.$contacts,
      placeID: this.model.get('id')
    });
    contacts.render();
    return this;
  }
}

export default Page;
