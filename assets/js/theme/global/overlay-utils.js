export default class OverlayUtils {
  constructor() {
    this.$body = $(document.body);
    this.$pageLoader = $('.loading-overlay');
  }

  show() {
    if(!this.$body.hasClass('scroll-locked')) this.$body.addClass('scroll-locked');
    if(!this.$pageLoader.hasClass('visible')) this.$pageLoader.addClass('visible');
  }

  hide() {
    this.$body.removeClass('scroll-locked');
    this.$pageLoader.removeClass('visible');
  }
}
