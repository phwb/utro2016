'use strict';

// шаблоны
import _item    from './templates/schedule-item.jade';
// коллекции
import shifts   from '../../collections/shifts';
import allDays  from '../../collections/days';

let $ = Backbone.$;
// выбранная смена
let shift = shifts.findWhere({selected: true});
// выбираем дни, которые принадлежат текущй смене
let days = allDays.where({shiftID: shift.get('id')});

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

// вкладка Расписание
class Schedule extends Backbone.View {
  get className() {
    return 'list-block media-list';
  }

  initialize({placeID = 0} = {}) {
    this.$list = $('<ul />').appendTo(this.$el);
    this.placeID = placeID;

    days.forEach(this.addItem, this);
  }

  addItem(model) {
    let view = new Item({model: model});
    this.$list.append( view.render( this.placeID ).$el );
  }
}

export default Schedule;
