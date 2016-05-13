class MenuItem extends Backbone.Model {
  get defaults() {
    return {
      name: '',
      code: ''
    };
  }
}

export default MenuItem;
