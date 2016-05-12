'use strict';

// шаблоны
import _navbar  from './templates/navbar.jade';
import _page    from './templates/page.jade';
import _item    from './templates/schedule-item.jade';
// коллекции
import days     from '../../collections/days';
import schedule from '../../collections/schedule';

let $ = Backbone.$;

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
    let first = this.model[0];
    this.pageID = first.get('dayID') + '-' + first.get('placeID');
  }

  addItem(model) {
    let view = new Item({model: model});
    this.$list.append( view.render().$el );
  }

  render() {
    let params = {
      id: this.pageID,
      list: this.model
    };
    this.$el.html( this.template( params ) );

    this.$list = this.$el.find('ul');
    if (this.model.length > 0) {
      this.model.forEach(this.addItem, this);
    }
    return this;
  }
}

// локальный кэш вьюшек
let cache = {};
function schedulePage(dayID, placeID) {
  let id = dayID && placeID ? dayID + '-' + placeID : false;

  if (!id) {
    return false;
  }

  if (!cache[id]) {
    // массив с расписанием для выбранного дня и площадки
    let list = schedule.where({
      dayID: dayID,
      placeID: placeID
    }) || [];
    // выбранный день
    let day = days.get(dayID);

    if (!list.length || !day) {
      return false;
    }

    cache[id] = {
      navbar: new Navbar({model: day}),
      page: new Page({model: list})
    };
  }

  return cache[id];
}

export default schedulePage;
