'use strict';

import experts from '../../collections/experts';

let _detail = `
<div class="content-block">
  <p><%= name %></p>
</div>
<div class="card ks-card-header-pic">
  <div style="background-image: url(<%= photo %>)" valign="bottom" class="card-header color-white no-border"></div>
  <div class="card-content">
    <div class="card-content-inner">
      <p><%= text %></p>
    </div>
  </div>
</div>
`;
let template = _.template(_detail);

class Page extends Backbone.View {
  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть эксперта, нужно передать айдишник');
    }

    let model = experts.get(id);
    if (!model) {
      throw new Error(`на нашли эксперта с таким айдишником ${id}`);
    }

    this.$content = this.$el.find('.page-content');
    this.model = model;
  }

  render() {
    if (!this.model) {
      return this;
    }
    this.$content.html( template( this.model.toJSON() ) );
    return this;
  }
}

export default Page;
