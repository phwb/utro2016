'use strict';

import {myAlert} from '../app/helpers';
import Page from '../views/map/page';

function loadScript() {
  let time = 600;
  return new Promise((resolve, reject) => {
    if (window.hasOwnProperty('ymaps')) {
      // микро хак, чтоб не тормозила анимация при добавлении карты в DOM
      setTimeout(() => resolve(window.ymaps), time);
      return true;
    }

    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    let timer;

    function leanUp() {
      clearTimeout(timer);
      script.onerror = script.onreadystatechange = script.onload = null;
    }

    function onLoad() {
      leanUp();
      if(!script.onreadystatechange || (script.readyState && script.readyState === 'complete')) {
        resolve(window.ymaps);
      }
    }

    script.onerror = function() {
      leanUp();
      head.removeChild(script);
      script = null;
      reject(new Error('network'));
    };

    if (!script.onreadystatechange) {
      script.onload = onLoad;
    } else {
      script.onreadystatechange = onLoad;
    }

    timer = setTimeout(script.onerror, 31000);

    script.setAttribute('src', 'https://api-maps.yandex.ru/2.0/?load=package.standard,package.geoObjects&lang=ru-RU');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'utf-8');
    script.setAttribute('async', 'async');

    setTimeout(() => head.appendChild(script), time);
  });
}

module.exports = function (container) {
  let page = new Page({
    el: container
  });

  loadScript()
    .then(ymaps => page.renderMap(ymaps))
    .catch(() => myAlert('Ошибка интернет соединения!'));

  return page;
};
