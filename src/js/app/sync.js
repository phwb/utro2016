'use strict';

let ajax = Backbone.ajax;
let defaults = {
  domain: 'http://api.utro2016.loc'
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

class Sync {
  constructor(collection) {
    return new Promise((resolve, reject) => {
      collection.fetch({
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
      });
    });
  }
}

export default Sync;
