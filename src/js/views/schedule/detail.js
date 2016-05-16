'use strict';

import schedule from '../../collections/schedule';

let detail = `
<div class="content-block-title">Название</div>
<div class="content-block">
  <div class="content-block-inner"><%= name %></div>
</div>
<div class="content-block-title">Начало</div>
<div class="content-block">
  <div class="content-block-inner"><%= start %></div>
</div>
`;
let template = _.template(detail);

class Page extends Backbone.View {
  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть расписание, нужно передать айдишник');
    }

    let model = schedule.get(id);
    if (!model) {
      throw new Error(`на нашли расписание с таким айдишником ${id}`);
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
