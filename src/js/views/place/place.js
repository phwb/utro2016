'use strict';

// шаблоны
import _navbar  from './templates/navbar.jade';
import _page    from './templates/page.jade';
// коллекции
import places   from '../../collections/places';
// табы
import Schedule from './schedule';
import Contacts from './contacts';

// навбар
class Navbar extends Backbone.View {
  get className() {
    return 'navbar';
  }

  get template() {
    return _.template(_navbar);
  }

  render() {
    this.$el.html( this.template( this.model.toJSON() ) );
    return this;
  }
}

// полностью вся страница
class Page extends Backbone.View {
  get className() {
    return 'pages';
  }

  get template() {
    return _.template(_page);
  }

  initialize() {
    this.placeID = this.model.get('id');
    // вьюшка расписания
    this.schedule = new Schedule({placeID: this.placeID});
    // вьюшка контактов
    this.contacts = new Contacts({placeID: this.placeID});
  }

  render() {
    // рендерим саму страницу
    this.$el.html( this.template( this.model.toJSON() ) );

    // рендерим расписание
    let $schedule = this.$el.find('#place-schedule-' + this.placeID);
    $schedule.html(this.schedule.$el);

    // рендерим контакты
    let $contacts = this.$el.find('#place-contacts-' + this.placeID);
    $contacts.html(this.contacts.$el);

    return this;
  }
}

// локальный кэш вьюшек
let cache = {};
function placePage(id) {
  if (!id) {
    return false;
  }

  if (!cache[id]) {
    let place = places.get(id);

    if (!place) {
      return false;
    }

    cache[id] = {
      navbar: new Navbar({model: place}),
      page: new Page({model: place})
    };
  }

  return cache[id];
}

export default placePage;
