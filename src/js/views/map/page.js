'use strict';

import {myAlert} from '../../app/helpers';
import {YMaps, TilerConverter} from '../../app/ymaps-utils';
import legend from './legend.json';

let geolocation = navigator.geolocation;
let watchID;

class Page extends Backbone.View {
  initialize() {
    this.$el.find('.toolbar-location').addClass('is-active');

    this.map = this.ymaps = this.placemark = null;
    this.geoParams = {
      timeout: 30000,
      enableHighAccuracy: true,
      maximumAge: 0
    };
  }

  onSuccess(position) {
    if (!this.map || !this.ymaps) {
      return this;
    }

    let coords = [position.coords.latitude, position.coords.longitude];

    this.placemark = new this.ymaps.Placemark(coords, {}, {
      preset: 'twirl#redDotIcon'
    });
    this.map.geoObjects.add(this.placemark);
    this.map.setCenter(coords);

    if (watchID) {
      geolocation.clearWatch(watchID);
    }
    watchID = geolocation.watchPosition(this.watch.bind(this), this.onError, this.geoParams);
  }

  watch(position) {
    if (!this.placemark) {
      return this;
    }
    let coords = [position.coords.latitude, position.coords.longitude];
    this.placemark.geometry.setCoordinates(coords);
  }

  onError() {
    myAlert('Ошибка геопозиционирования, попробуйте перезагрузить устройство!');
    if (watchID) {
      geolocation.clearWatch(watchID);
    }
  }

  renderMap(ymaps) {
    let map = this.$el.find('.page-content');
    let options = {
      mapID: map[0],
      tileUrlTemplate: 'img/tiles/%z/tile-%x-%y.png',
      controls: {
        typeControl: true,
        miniMap: false,
        toolBar: false,
        scaleLine: false
      },
      scrollZoomEnabled: false,
      mapCenter: new YMaps.GeoPoint(72.6475069356181, 61.1062448990049),
      backgroundMapType: YMaps.MapType.NONE,
      mapZoom: 17,
      isTransparent: true,
      smoothZooming: false,
      layerKey: 'utro2016#layer',
      mapType: {
        name: 'Утро 2016',
        textColor: '#000000'
      },
      copyright: 'Утро 2016',
      restrictMapArea: [
        [61.1091368164979, 72.6391920876719],
        [61.103352716175, 72.6558217835642]
      ]
    };

    ymaps.ready(() => {
      this.map = (new TilerConverter(options)).getMap();
      this.ymaps = ymaps;

      let objects = new ymaps.GeoObjectCollection({}, {
        preset: 'twirl#blueStretchyIcon'
      });
      legend.forEach(item => {
        let object =  new ymaps.GeoObject({
          geometry: {
            type: 'Point',
            coordinates: item.coords
          },
          properties: {
            iconContent: item.name,
            balloonContent: item.text
          }
        }, {
          // Метку можно перемещать.
          draggable: true
        });
        object.events.add('dragend', function (e) {
          console.log(e.originalEvent.target.geometry.getCoordinates());
        });
        objects.add(object);
      });

      this.map.geoObjects.add(objects);
      geolocation.getCurrentPosition(this.onSuccess.bind(this), this.onError, this.geoParams);
    });
  }
}

export default Page;
