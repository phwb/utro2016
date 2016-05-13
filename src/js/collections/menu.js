import MenuItem from '../models/menu';

class Menu extends Backbone.Collection {
  get model() {
    return MenuItem;
  }
}

export default Menu;
