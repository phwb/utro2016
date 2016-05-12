'use strict';

// шаблоны
import _navbar  from './templates/navbar.jade';
import _page    from './templates/page.jade';
import _item    from './templates/list-item.jade';
// коллекции
import shifts   from '../../collections/shifts';
import places   from '../../collections/places';
import allDays  from '../../collections/days';

let $ = Backbone.$;
// выбранная смена
let shift = shifts.findWhere({selected: true});
// дни, которые принадлежат текущй смене
let days = allDays.where({shiftID: shift.get('id')});

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
/*class Contacts extends Backbone.View {

}*/

// вкладка Расписание
class Schedule extends Backbone.View {
  get className() {
    return 'list-block media-list';
  }

  initialize(params) {
    this.$list = $('<ul />').appendTo(this.$el);
    this.placeID = params.placeID;
  }

  addItem(model) {
    let view = new Item({model: model});
    this.$list.append( view.render(this.placeID).$el );
  }

  render() {
    days.forEach(this.addItem, this);
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
    this.$el.html( this.template( this.model.toJSON() ) );

    let placeID = this.model.get('id');
    // расписание
    this.$schedule = this.$el.find('#place-schedule-' + placeID);
    this.schedule = new Schedule({
      placeID: placeID
    });

    this.$contacts = this.$el.find('#place-contacts-' + placeID);
  }

  render() {
    this.$schedule.html( this.schedule.render().$el );
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
