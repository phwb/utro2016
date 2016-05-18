'use strict';

class Option extends Backbone.View {
  get tagName() {
    return 'option';
  }

  get events() {
    return {
      'selected': 'optionChangedHandler'
    };
  }

  optionChangedHandler() {
    this.model.trigger('selected', this.model);
  }

  render() {
    let params = this.model.toJSON();
    this.$el
      .text(params.name)
      .val(params.id);
    return this;
  }
}

class Select extends Backbone.View {
  initialize() {
    this.listenTo(this.collection, 'selected', this.change);
  }

  change(model) {
    return model;
  }

  tagName() {
    return 'select';
  }

  // не большой хак для события change, так как на option нельзя 
  // повестить какое либо событие, то вешам его на весь select
  get events() {
    return {
      'change': 'changeHandler'
    };
  }

  changeHandler() {
    this.$el.find('option:selected').trigger('selected');
  }

  get Option() {
    return Option;
  }

  addItem(model) {
    let option = new this.Option({model: model});
    this.$el.append( option.render().$el );
  }

  render() {
    this.collection.each(this.addItem, this);
    return this;
  }
}

export {Select};
