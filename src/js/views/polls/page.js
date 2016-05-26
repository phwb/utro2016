'use strict';

import {logger}     from '../../app/helpers';
import polls        from '../../collections/polls';
import {SimpleLink} from '../ui/list';
import {PullDown}   from '../ui/page';

class List extends SimpleLink {

}

/*class Page extends PullDown {
  get collection() {
    return polls;
  }

  initialize() {
    super.initialize();
    this.$list = this.$el.find('.list-block');
    logger(this);
  }

  addAll() {
    let collection = this.collection;
    if (!collection.length) {
      if (collection.status !== 'pending') {
        this.$empty.show();
      }

      logger('пустая коллекция', collection.url);
      return this;
    }

    let view = new List({
      collection: collection,
      href: function (model) {
        return `polls/detail.html?id=${model.get('id')}`;
      }
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }
}*/

class Page extends Backbone.View {
  get collection() {
    return polls;
  }

  // + pull to refresh
  get events() {
    return {
      'refresh     .pull-to-refresh-content': 'refreshStart',
      'refreshdone .pull-to-refresh-content': 'refreshDone'
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
    // после завершения операции обновления нужно вызвать триггер  "refreshend"
    // даже в случае с reject
    collection
      .refresh()
      .then(() => {
        logger('then');
        this.$pull.trigger('refreshend');
      })
      .catch(() => {
        logger('catch');
        this.$pull.trigger('refreshend');
      });
  }

  refreshDone() {
    logger('refresh.end', this.collection.url);
    this.addAll();
  }
  // - pull to refresh

  initialize() {
    let collection = this.collection;
    this.listenTo(collection, 'reset', this.addAll);

    this.listenTo(collection, 'sync:ajax.start', this.loadStart);
    this.listenTo(collection, 'sync:ajax.end',   this.loadSuccess);
    this.listenTo(collection, 'sync:error',      this.loadError);

    this.$list = this.$el.find('.list-block');
    this.$pull = this.$el.find('.pull-to-refresh-content');
    this.$empty = this.$el.find('.empty-page');

    let status = collection.status;
    if (status && status === 'pending') {
      this.loadStart();
    }
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
    // TODO: как-то отреагировать на ошибку загрузки
  }

  addAll() {
    logger('addAll');
    let collection = this.collection;
    if (!collection.length) {
      if (collection.status !== 'pending') {
        this.$empty.show();
      }

      logger('пустая коллекция', collection.url);
      return this;
    }

    let view = new List({
      collection: collection,
      href: function (model) {
        return `polls/detail.html?id=${model.get('id')}`;
      }
    });

    this.$empty.hide();
    this.$list.html( view.render().$el );
  }

  render() {
    this.addAll();
    return this;
  }
}

export default Page;
