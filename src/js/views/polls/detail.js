'use strict';

import {logger}         from '../../app/helpers';
import polls            from '../../collections/polls';
import {getPollFields}  from '../../app/sync';
import Form             from './poll-form';
import Result           from './poll-result';

function setTitle(model) {
  let $ = Backbone.$;
  $('.poll-title').text(model.get('name'));
}


class Page extends Backbone.View {
  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть опрос, нужно передать айдишник');
    }

    let model = polls.get(id);
    if (!model) {
      throw new Error(`на нашли опрос с таким айдишником ${id}`);
    }

    this.$empty = this.$el.find('.empty-page');
    this.$content = this.$el.find('.content-block-inner');
    this.model = model;

    // событие всплывает когда нажали на кнопку отправить в форме
    this.listenTo(this.model, 'vote:submit', this.submitFrom);
    // стандартное событие изменения модели
    this.listenTo(this.model, 'change:voted', this.render);
  }

  render() {
    if (!this.model) {
      return this;
    }
    setTitle(this.model);

    this.$empty.hide();
    let voted = this.model.get('voted');

    getPollFields(this.model)
      .then(questions => this[ voted ? '_renderResult' : '_renderForm' ](questions))
      .catch(e => {
        this.$empty.show();
        logger.error(e);
      })
      .then(() => {
        // TODO hide ajax loader
      });

    return this;
  }

  _renderResult(questions) {
    if (!questions) {
      throw new Error('poll-result: ajax вернул пустой ответ');
    }

    let result = new Result({
      collection: questions,
      el: this.$content
    });
    result.render();
  }

  _renderForm(questions) {
    if (!questions) {
      throw new Error('poll-form: ajax вернул пустой ответ');
    }

    let form = new Form({
      collection: questions,
      model: this.model,
      el: this.$content
    });
    form.render();
  }

  submitFrom(params) {
    if (!params) {
      return this;
    }
    // TODO ajax request here
    this.model.set({voted: true}).save();
  }
}

export default Page;
