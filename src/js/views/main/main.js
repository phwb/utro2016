'use strict';

// шаблоны
import _main  from './templates/main-page.jade';
import _item  from './templates/main-list-item.jade';
// коллекции
import shifts from '../../collections/shifts';
import places from '../../collections/places';

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

class List extends Backbone.View {
  get tagName() {
    return 'ul';
  }

  initialize() {
    // событие происходят в функции initSync()
    //
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но «reset» так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    this.listenTo(places, 'reset', this.addAll);
    this.listenTo(places, 'sync:ajax.end', this.loadSuccess);
    // событие происходит при выборе смены
    this.listenTo(shifts, 'change:selected', this.changeShift);
  }

  loadSuccess() {
    this.addAll();
  }

  changeShift() {
    this.addAll();
  }

  addAll() {
    let shift = shifts.findWhere({selected: true});

    if (!shift) {
      console.log('надо выбрать смену');
      return this;
    }

    let shiftID = shift.get('id');
    let currentPlaces = places.where({shiftID: shiftID}) || [];

    if (!currentPlaces.length) {
      console.log('площадки еще не загрузились');
      return this;
    }

    currentPlaces.forEach(this.addItem, this);
  }

  addItem(model) {
    let item = new Item({
      model: model
    });
    this.$el.append( item.render().$el );
  }
}
let list = new List();

class Main extends Backbone.View {
  get className() {
    return 'page-content';
  }

  get template() {
    return _.template(_main);
  }

  initialize() {
    this.$list = this.$el.find('.list-block');
  }

  render() {
    this.$el.html( this.template() ).find('.list-block').html( list.render().$el );
    return this;
  }
}

export default Main;
