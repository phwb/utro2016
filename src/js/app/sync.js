'use strict';

let ajax = Backbone.ajax;
let defaults = {
  domain: 'http://api.utro2016.loc'
  // domain: 'http://192.168.1.46/local/api'
};

function camelize(str) {
  return str.toLowerCase().replace(/_(.)/g, function(match, index) {
    return index.toUpperCase();
  });
}

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
      let mapKey = map.hasOwnProperty(key) ? map[key] : camelize(key);
      let val = key === 'SORT' ? +obj[key] : obj[key];
      // если пришло значение, то установми его
      // иначе его по дефолту поставит Backbone
      if (!!val) {
        result[mapKey] = val;
      }
    }
  }
  return result;
}

class Sync {
  constructor(collection) {
    // статус ajax запроса
    collection.status = false;
    // добавляем к коллекции функцию обновления
    collection.refresh = () => this.update({
      method: 'update',
      force: false
    });
    // сохраним коллекцию в поле класса, для дальнейшего использования
    this.collection = collection;

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
      console.time(`ajax`);
      collection.status = 'pending';
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
    let collection = this.collection;

    console.timeEnd(`ajax`);
    if (!items.length) {
      reject(new Error(`Пустой массив ITEMS ${collection.url}`));
    }

    // ищем карту соответствия полей с сервера полям из модели
    // если карта пустая, то просто создадим модель с полями
    // пришедшими с сервера в нижнем регистре
    console.time(`parse`);
    let syncMap = collection.model.prototype.syncMap || {};
    let len = items.length;

    // let t = collection.url === '/contacts' ? 5000 : 10;
    // setTimeout(() => {

    items.forEach(item => {
      let param = getModelParams(item, syncMap);
      collection.create(param, {
        silent: true,
        // функция success выполняется каждый раз когда успешно сохраняется модель в БД,
        // но из того что "Расписание" слишком большое, сохранение проходит долго ~23 секунды
        // поэтому функцию resolve мы вызываем только тогда, когда все модели данной коллекции сохранены
        success: function () {
          len -= 1;
          if (len < 1) {
            // по завершению записи колллекции в БД, просигналим событием об этом
            collection.status = false;
            collection.trigger('sync:ajax.end', collection);
            // передадим управления дальше
            resolve({
              timestamp: timestamp,
              method: 'set'
            });
            console.timeEnd(`parse`);
            return true;
          }
        },
        // ну и на всякий случай вызываем reject в случае ошибки
        error: reject.bind(this)
      });
    });

    // }, t);
  }

  ajaxError(reject) {
    reject(new Error('Ошибка ajax запроса'));
  }

  update({timestamp = false, method = 'update', force = true} = {}) {
    return new Promise((resolve, reject) => {
      if (force) {
        resolve();
      }

      let collection = this.collection;
      // тут на прямую используется localForage
      // это конечно не совсем правильно, но обертку писать пока не хочется
      let lf = Backbone.localforage.localforageInstance;
      // ключ по которому будем сохранять дату последнего обновления
      let key = this._getKey(collection.sync.localforageKey);
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
            value = value || '';
            collection.trigger('sync:ajax.start');

            let params = {
              url: url,
              data: {
                lastUpdateDate: value
              },
              dataType: 'json'
            };
            ajax(params)
              .done(data => {
                this.ajaxUpdateSuccess(data).then(() => resolve());
              })
              .fail(() => reject(new Error(`Ошибка обновления ${key}`)))
              .always(() => collection.trigger('sync:ajax.end'));
          })
          .catch(() => reject(new Error('ошибка чтения из localForage')));
        return this;
      }
    });
  }

  ajaxUpdateSuccess(data) {
    return new Promise(resolve => {
      let items = data.ITEMS || [];
      let timestamp = data.LAST_DATE_UPDATE || false;

      if (!items.length) {
        resolve();
        return this;
      }

      let collection = this.collection;
      let syncMap = collection.model.prototype.syncMap || {};

      // подготавливаем параметры для вставки в коллекцию
      let params = items.map(item => getModelParams(item, syncMap));

      // метод set достаточно умный, чтоб обновить или создать модель в коллекции
      // возвращает созданные/обновленные модели
      // --------------
      // remove = false обязательно, иначе из коллекции удалятся остальные модели
      let models = collection.set(params, {remove: false});

      // теперь сохрнаим их в БД
      let len = models.length;
      models.forEach(model => model.save(null, {
        success: () => {
          len -= 1;
          // только после того как все модели сохранились
          // вызовем resolve и обновим timestamp
          if (len < 1) {
            if (timestamp) {
              this.update({
                timestamp: timestamp,
                method: 'set'
              });
            }
            resolve();
          }
        }
      }));
    });
  }

  error() {
    let e = arguments[0];
    if (!(e instanceof Error)) {
      e = new Error('Неизвестная ошибка');
    }
    this.collection.trigger('sync:error', e);
    this.collection.status = false;

    console.error('reject', arguments);
    console.groupEnd();
  }

  done() {
    this.collection.status = false;
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

// вспомогательная функция для получения опросов
export function getPollFields(model) {
  return new Promise((resolve, reject) => {
    if (!model.collection) {
      reject(new Error('Нет коллекции опросов'));
    }

    let url = model.collection.url;
    if (!url) {
      reject(new Error('Пустой URL опросов'));
    }

    let id = model.get('id');
    let params = {
      url: defaults.domain + url + '/' + id
    };
    ajax(params)
      .done(data => {
        let questions = data.QUESTIONS || [];
        if (!questions.length) {
          reject(new Error('Нет вопросов'));
        }

        let answerMap = {
          ID: 'id',
          TEXT: 'name',
          TEXT_TYPE: 'textType',
          FIELD_TYPE: 'type',
          PERCENT: 'percent'
        };
        let params = questions.map(question => {
          let answers = question.ANSWERS || [];

          if (answers.length) {
            answers = answers.map(answer => {
              let map = getModelParams(answer, answerMap);
              map.questionID = question.ID;
              return map;
            });
          }

          let result = getModelParams(question);
          result.answers = answers;
          return result;
        });

        resolve(params);
      })
      .fail(() => {
        reject(new Error('ajax fail'));
      });
  });
}
