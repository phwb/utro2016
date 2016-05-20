'use strict';

// коллекции
import places from '../../collections/places';
// дополнительные вьюшки
import ScheduleDays from './tab-schedule-days';
import ContactList from './tab-contacts';

let $ = Backbone.$;

class Page extends Backbone.View {
  initialize(params) {
    // сначала всегда полагаем что есть ошибки
    this.error = true;

    let id = params.id || false;
    if (!id) {
      console.log('как то это странно, сюда попасть по идее не реально');
      return this;
    }

    let model = places.get(id);
    if (!model) {
      console.log(`че то вообще странное творится, не найдена площадка ${id}`);
      return this;
    }

    // если дошли до сюда, значит ошибок нет
    this.error = false;

    // кэшируем табы
    this.$desc = this.$el.find('#place-desc .b-tabs__content');
    this.$schedule = this.$el.find('#place-schedule .b-tabs__content');
    this.$contacts = this.$el.find('#place-contacts .b-tabs__content');
    // сохрнаим модель
    this.model = model;
    // установим заголово экрана
    this.setTitle();
  }

  setTitle() {
    let name = this.model.get('shortName');
    let $title = $('.navbar-title');
    $title.text(`Урал ${name}`);
  }

  render() {
    // если ошибка то она выведется в консоль выше
    if (this.error) {
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
      placeID: this.model.get('id')
    });
    this.$contacts.html( contacts.render().$el );
    return this;
  }
}

export default Page;
