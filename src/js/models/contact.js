/**
 * @property {number} _place ID площадки, к которой привязан контакт
 */
export default Backbone.Model.extend({
  defaults: {
    name: 'no name',
    image: '',
    text: '',
    phone: '',

    /**
     * @private
     */
    _place: ''
  }
});
