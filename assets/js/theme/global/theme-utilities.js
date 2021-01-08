export default class ThemeUtilities {
  constructor(context) {
    this.context = context;
    this.breakPoints = this.context.breakPoints;
  }

  /**
   * @returns {Number}
   * @private
   */
  _getWindowWidth() {
    return $(window).outerWidth();
  }

  /**
   * @returns {Number}
   * @private
   */
  _getWindowHeight() {
    return $(window).outerHeight();
  }

  /**
   * More on window detection: http://ryanve.com/lab/dimensions/
   *
   * @param url
   * @param title
   * @param popupWidth
   * @param popupHeight
   */
  popupCenter(url, title, popupWidth, popupHeight) {
    // Fixes dual-screen position                         Most browsers      Firefox
    const dualScreenLeft = (typeof window.screenLeft !== 'undefined' ? window.screenLeft : screen.left);
    const dualScreenTop = (typeof window.screenTop !== 'undefined' ? window.screenTop : screen.top);

    const outerWidth = this._getWindowWidth();
    const outerHeight = this._getWindowHeight();

    if (!popupWidth) {
      popupWidth = 500;
    }
    if (!popupHeight) {
      popupHeight = 300;
    }

    const left = ((outerWidth / 2) - (popupWidth / 2)) + dualScreenLeft;
    const top = ((outerHeight / 3) - (popupHeight / 3)) + dualScreenTop;

    const newWindow = window.open(url, title, `scrollbars=yes, width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  }

  /**
   * Detect to see if JS should fire based generically on screen size
   * @returns {boolean}
   */
  isSmallScreen() {
    return this.deviceSize('small', 'equalTo') || this.deviceSize('medium', 'equalTo');
  }

  /**
   * @param breakpointName
   * @param operator
   * @returns {boolean}
   */
  deviceSize(breakpointName, operator) {

    const windowWidth = this._getWindowWidth();
    const dimensions = this.breakPoints[breakpointName];

    switch (operator) {
      case 'greaterThan':
      case '<':
        //Is the current screen size greater than the end of breakpointName?
        return (dimensions.end <= windowWidth);
      case 'lessThan':
      case '>':
        //Is current screen size less than the start of breakpointName?
        return (dimensions.start >= windowWidth);
      case 'notEqualTo':
      case '!==':
        //Is current screen size not in breakpointName?
        return !((dimensions.start <= windowWidth) && (dimensions.end >= windowWidth));
      case 'equalTo':
      case '===':
      default:
        //Is current screen size in breakpointName?
        return ((dimensions.start <= windowWidth) && (dimensions.end >= windowWidth));
    }
  }
}
