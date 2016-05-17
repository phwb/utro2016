'use strict';

import news from '../../collections/news';

let _detail = `
<div class="content-block">
  <p><%= name %></p>
</div>
<div class="card ks-card-header-pic">
  <div style="background-image: url(<%= previewPicture %>)" valign="bottom" class="card-header color-white no-border"></div>
  <div class="card-content">
    <div class="card-content-inner">
      <p class="color-gray"><%= _.template.formatDate('dd Mm yyyy', new Date(date * 1000)) %></p>
      <p><%= text %></p>
    </div>
  </div>
</div>
`;
let template = _.template(_detail);

class Page extends Backbone.View {
  initialize({id} = {}) {
    if (!id) {
      throw new Error('чтобы посмотреть новость, нужно передать айдишник');
    }

    let model = news.get(id);
    if (!model) {
      throw new Error(`на нашли новость с таким айдишником ${id}`);
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
