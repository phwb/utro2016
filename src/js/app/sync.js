'use strict';

let ajax = Backbone.ajax;
let defaults = {
  domain: 'http://api.utro2016.loc'
  // domain: 'http://192.168.1.46/local/api'
};

/**
 * Функция возвращает объект соответствия ключей с сервреа ключам из модели
 *
 * @param {object} obj  - объект пришедший с сервера
 * @param {object} map  - ассоциативная карта <ключ сервера> : <ключ модели>
 * @returns {object}    - объект для создания модели
 */
function getModelParams(obj, map = {}) {
  let result = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let mapKey = map.hasOwnProperty(key) ? map[key] : key.toLocaleLowerCase();
      // если пришло значение, то установми его
      // иначе его по дефолту поставит Backbone
      if (!!obj[key]) {
        result[mapKey] = obj[key];
      }
    }
  }
  return result;
}

/*self.collection.fetch({
  reset: true,
  success: function (collection) {
    // если коллекция после получения имеет какие то данные
    // то просто передадим управление дальше
    if (collection.length > 0) {
      collection.trigger('sync:db', collection, {type: 'sync:db'});
      return resolve({
        type: 'sync:db'
      });
    }

    // ищем карту соответствия полей с сервера полям из модели
    // если карта пустая, то просто создадим модель с полями
    // пришедшими с сервера в нижнем регистре
    let syncMap = collection.model.prototype.syncMap || {};
    let url = collection.url || '';

    // если УРЛ оказался пустым по просто ничего не загружаем
    if (!url) {
      return reject('Пустой URL');
    }

    collection.trigger('sync:ajax.start');
    ajax({
      url: defaults.domain + url,
      dataType: 'json'
    })
      .then(data => {
        let items = data.ITEMS || [];
        // let lastDateUpdate = data.LAST_DATE_UPDATE || false;

        if (!_.isArray(items)) {
          return reject('Пустой массив ITEMS');
        }

        items.forEach(item => {
          let param = getModelParams(item, syncMap);
          collection.create(param, {silent: true});
        });

        collection.trigger('sync:ajax.end', collection, {type: 'sync:ajax.end'});
        return resolve({
          type: 'sync:ajax'
        });
      });
  },
  error: () => reject(arguments)
});*/

class Sync {
  constructor(collection) {
    // сохраним коллекцию в поле класса, для дальнейшего использования =
    this.collection = collection;
    collection.refresh = () => this.update({
      method: 'update',
      force: false
    });

    // вызовем метод синхронизации
    return this.fetch();
  }

  fetch() {
    console.group(`sync:fetch ${this.collection.url}`);
    let promise =  new Promise((resolve, reject) => {
      this.collection.fetch({
        reset: true,
        success: resolve.bind(this),
        error: reject.bind(this)
      });
    });

    return promise
      .then(this.fetchSuccess.bind(this))
      .then(this.update.bind(this))
      .then(this.done.bind(this))
      .catch(this.error.bind(this));
  }

  fetchSuccess(collection) {
    return new Promise((resolve, reject) => {
      // если коллекция после получения имеет какие то данные
      // то просто передадим управление дальше
      if (collection.length > 0) {
        collection.trigger('sync:db', collection);
        return resolve();
      }

      // если коллекция пустая, значит это скорее всего первый запуск
      // и надо получить данный с сервера
      collection.trigger('sync:ajax.start');

      let url = this._getUrl();
      let promiseParams = {
        resolve: resolve,
        reject: reject
      };
      let params = {
        url: url,
        dataType: 'json'
      };
      ajax(params)
        .done(this.ajaxSuccess.bind(this, promiseParams))
        .fail(this.ajaxError.bind(this, reject));
    });
  }

  /**
   * Промис, сохранен чтобы по завершению аякс запроса можно было передать управление дальше:
   * @param resolve
   * @param reject
   *
   * Ответ от сервера:
   * @param {object} data                         - объект который вернул аякс запрос
   * @property {array} data.ITEMS                 - массив с моделями
   * @property {timestamp} data.LAST_DATE_UPDATE  - дата последнего обновления
   */
  ajaxSuccess({resolve, reject}, data = {}) {
    let items = data.ITEMS || [];
    let timestamp = data.LAST_DATE_UPDATE || false;

    if (!items.length) {
      reject(new Error('Пустой массив ITEMS'));
    }

    let collection = this.collection;

    // ищем карту соответствия полей с сервера полям из модели
    // если карта пустая, то просто создадим модель с полями
    // пришедшими с сервера в нижнем регистре
    let syncMap = collection.model.prototype.syncMap || {};

    items.forEach(item => {
      let param = getModelParams(item, syncMap);
      collection.create(param, {silent: true});
    });

    // по завершению записи колллекции в БД, просигналим событием об этом
    collection.trigger('sync:ajax.end', collection, {type: 'sync:ajax.end'});
    // передадим управления дальше
    resolve({
      timestamp: timestamp,
      method: 'set'
    });
  }

  ajaxError(reject) {
    reject(new Error('Ошибка ajax запроса'));
  }

  update({timestamp = false, method = 'update', force = true} = {}) {
    return new Promise((resolve, reject) => {
      if (force) {
        resolve();
      }

      // тут на прямую используется localForage
      // это конечно не совсем правильно, но обертку писать пока не хочется
      let lf = Backbone.localforage.localforageInstance;
      // ключ по которому будем сохранять дату последнего обновления
      let key = this._getKey(this.collection.sync.localforageKey);
      let url = this._getUrl();

      if (method === 'set' && timestamp) {
        lf.setItem(key, timestamp)
          .then(() => resolve())
          .catch(() => reject(new Error('ошибка записи в localForage')));
        return this;
      }

      if (method === 'update') {
        lf.getItem(key)
          .then(value => {
            if (value) {
              console.log(`обновление ${this.collection.url}, timestamp = ${value}`);
              let params = {
                url: url,
                data: {
                  lastUpdateDate: value
                },
                dataType: 'json'
              };
              ajax(params)
                .done((data) => {
                  // вот это мне не сильно нравится, лучше обновлять конкретную модель
                  // и подписываться на событие change, а так мы сбрасываем всю коллекцию
                  // если переделывать то в функции ajaxUpdateSuccess нужно изменить
                  // collection.create на что нибудь другое
                  this.ajaxUpdateSuccess(data);
                  this.collection.fetch({reset: true});
                  resolve();
                })
                .fail(() => reject(new Error(`Ошибка обновления ${key}`)));
            }
          })
          .catch(() => reject(new Error('ошибка чтения в localForage')));
      }
    });
  }

  ajaxUpdateSuccess(data) {
    let items = data.ITEMS || [];
    let timestamp = data.LAST_DATE_UPDATE || false;

    if (!items.length) {
      console.log(`обновления ${this.collection.url} не требуются`);
      return this;
    }

    let collection = this.collection;
    let syncMap = collection.model.prototype.syncMap || {};

    items.forEach(item => {
      let param = getModelParams(item, syncMap);
      collection.create(param, {silent: true});
    });

    if (timestamp) {
      this.update({
        timestamp: timestamp,
        method: 'set'
      });
    }
  }

  error() {
    // тут можно как то залогировать ошибки
    console.log('reject', arguments);
  }

  done() {
    console.groupEnd();
  }

  _getKey(key) {
    let prefix = 'timestamp';
    return `${key}-${prefix}`;
  }

  _getUrl() {
    let url = this.collection.url || false;
    // если УРЛ оказался пустым по просто ничего не загружаем
    if (!url) {
      throw new Error('Пустой URL');
    }
    return defaults.domain + url;
  }
}

export default Sync;
