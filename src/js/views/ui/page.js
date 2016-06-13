'use strict';

import {logger, myAlert} from '../../app/helpers';

/**
 * Класс для страницы с возможностью pull down
 * В этом классе описаны базовые события и реакция на них
 *
 * События:
 *    1. reset
 *    2. sync:ajax.start
 *    3. sync:ajax.end
 *    4. sync:error
 *    5. add
 *
 * Так же добавлено событие refresh от Framework7, которые срабатывае когда пользователь
 * обновляет страницу через pull down
 *
 * @extends Backbone.View
 */
class PullDown extends Backbone.View {
  get events() {
    return {
      'refresh .pull-to-refresh-content': 'refreshStart'
    };
  }

  refreshStart() {
    let collection = this.collection;

    // в случае если еще не сработал Sync
    if (!collection.refresh) {
      // можно показать алерт что коллекция в очереди на заргузку
      this.$pull.trigger('refreshend');
      return this;
    }

    logger('refresh.start', collection.url);
    // после завершения операции обновления нужно вызвать триггер  "refreshend",
    // чтобы скрыть анимацию лоадера, даже в случае с catch
    collection
      .refresh()
      .then(() => this.$pull.trigger('refreshend'))
      .catch(() => this.$pull.trigger('refreshend'));
  }

  /**
   * @constructor
   */
  initialize() {
    // события происходят в функции initSync()
    // --------------
    // «reset» происходит когда вызывается функция fetch у коллекции,
    // но reset так же вызывается когда коллекция пуста, то есть при первом запуске приложения
    // для этого как раз и есть событие «sync:ajax.end»
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);
    this.listenTo(collection, 'sync:ajax.start', this.loadStart);
    this.listenTo(collection, 'sync:ajax.end',   this.loadSuccess);
    this.listenTo(collection, 'sync:error',      this.loadError);
    // событие «add» срабатывает либо при повторном запуске приложения
    // когда вызывается функция update, либо когда когда сработал pull down
    this.listenTo(collection, 'add', this.addItem);

    this.$pull = this.$el.find('.pull-to-refresh-content');
    this.$empty = this.$el.find('.empty-page');

    let status = collection.status || false;
    if (status && status === 'pending') {
      this.loadStart();
    }
  }

  addAll() {
    // основная функция в который происходит какое то действие
  }

  loadStart() {
    this.$pull.addClass('refreshing');
    this.$empty.hide();
  }

  loadSuccess() {
    this.$pull.removeClass('refreshing');
    this.addAll();
  }

  loadError() {
    myAlert('Ошибка интернет соединения!');
  }

  /**
   * вызывается когда добавили "Модель" в коллецию, обычно это
   * происходит в функции update класса Sync
   */
  addItem() {
    // перекрывается в экземпляре, так как может менять поведение
  }

  render() {
    this.addAll();
    return this;
  }
}

export {PullDown};
