'use strict';

import _form     from './templates/poll-form.jade';
import _question from './templates/poll-form-question.jade';
import _answer   from './templates/poll-form-answer.jade';

class Answer extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get className() {
    return 'b-cr-list__item';
  }

  get template() {
    return _.template(_answer);
  }

  render() {
    this.$el.html( this.template( this.model ) );
    return this;
  }
}

class Question extends Backbone.View {
  get tagName() {
    return 'section';
  }

  get template() {
    return _.template(_question);
  }

  render() {
    let answers = this.model.answers;

    this.$el.html( this.template( this.model ) );
    this.$list = this.$el.find('.b-cr-list');

    answers.forEach(this.addAnswer, this);

    return this;
  }

  addAnswer(answer) {
    let view = new Answer({
      model: answer
    });
    this.$list.append( view.render().$el );
  }
}

class Form extends Backbone.View {
  get events() {
    return {
      'click .submit-vote': 'submit'
    };
  }

  submit() {
    let params = this.$el.find('form').serialize();
    this.model.trigger('vote:submit', params);
  }

  addAll() {
    // тут this.collection это не коллекция Backbone, а просто объект
    let questions = this.collection;
    if (!questions.length) {
      return this;
    }

    this.$el.html(_form);
    this.$list = this.$el.find('.questions');

    questions.forEach(this.addQuestion, this);
  }

  addQuestion(question) {
    let view = new Question({
      model: question
    });
    this.$list.append( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Form;
