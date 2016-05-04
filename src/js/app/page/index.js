'use strict';

import navbar from './navbar.jade';
import page from './page.jade';

let $ = Backbone.$;
let template = {};
let pageNumber = 0;

class Page {
  constructor({name = 'page-' + (pageNumber += 1), title = 'Заголовок'} = {}) {
    template.navbar = navbar.replace('#PAGE_TITLE#', title);
    template.page = page.replace('#PAGE_NAME#', name);

    this.$page = $(template.page);
    this.$navbar = $(template.navbar);
  }

  render() {
    return [
      this.$navbar[0],
      this.$page[0]
    ];
  }
}

export default Page;
