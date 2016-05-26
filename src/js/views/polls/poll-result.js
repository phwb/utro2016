'use strict';

import _question from './templates/poll-result-question.jade';
import _answer   from './templates/poll-result-answer.jade';

class Answer extends Backbone.View {
  get tagName() {
    return 'li';
  }

  get className() {
    return 'b-poll-result__item';
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
    this.$list = this.$el.find('.b-poll-result');

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

class Result extends Backbone.View {
  addAll() {
    // тут this.collection это не коллекция Backbone, а просто объект
    let questions = this.collection;
    if (!questions.length) {
      return this;
    }

    this.$el.html('');
    questions.forEach(this.addQuestion, this);
  }

  addQuestion(question) {
    let view = new Question({
      model: question
    });
    this.$el.append( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Result;
