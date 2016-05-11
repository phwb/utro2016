/**
 * @param {string} type может быть двух вариантов text или html
 */
export default Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    date: 0,
    timestamp: 0,
    previewPicture: '',
    detailPicture: '',
    type: 'text',
    text: ''
  },
  sync: Backbone.localforage.sync('news-item')
});
