/**
 * @property {number} _day    ID дня проведения
 * @property {number} _place  ID площадки, к которой привязано расписание
 */
export default Backbone.Model.extend({
  defaults: {
    id: 0,
    name: '',
    location: '',
    desc: '',
    start: '',
    end: '',

    /**
     * @private
     */
    _day: 0,
    _place: 0
  }
});
