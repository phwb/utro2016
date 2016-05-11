'use strict';

import navbar from './navbar.jade';
import page from './page.jade';

let $ = Backbone.$;
let template = {
  navbar: '',
  page: ''
};
let pageNumber = 0;

class Page {
  /**
   * @param {string} name   имя страницы, которе уходит в data-page
   * @param {string} title  заголовок страницы
   */
  constructor({
    name = 'page-' + (pageNumber += 1),
    title = 'Заголовок'
  } = {}) {
    template.navbar = navbar.replace('#PAGE_TITLE#', title);
    template.page = page.replace('#PAGE_NAME#', name);

    this.$navbar = $(template.navbar);
    this.$page = $(template.page);
    this.$content = this.$page.find('.page-content');
  }

  // геттер/сеттер для навбара
  get navbar() {
    return template.navbar;
  }

  set navbar(navbar) {
    template.navbar = navbar;
    this.$navbar = navbar instanceof $ ? navbar : $(template.navbar);
  }

  // геттер/сеттер для зоны контента
  get page() {
    return template.page;
  }

  set page(page) {
    template.page = page;
    this.$page = page instanceof $ ? page : $(template.page);
    this.$content = this.$page.find('.page-content');
  }

  get content() {
    return this.$content.html();
  }

  set content(content) {
    this.$content.html(content);
  }

  render() {
    return [
      this.$navbar[0],
      this.$page[0]
    ];
  }
}

export default Page;
