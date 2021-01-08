/**
 * Toggle a progress button state with alternate text
 * the button needs a class of button-progress
 * the button text needs to be wrapped in an extra .button-text element within the button element itself
 * the button should probably have a data-progress-text attribute
 */
export default class ProgressButton {
  static progress($button) {
    // cache the current button text
    $button.data('defaultText', $button.text());

    const progressText = $button.attr('data-progress-text') || '';

    $button
      .addClass('progress')
      .attr('disabled', 'disabled')
      .find('.button-text')
      .text(progressText);
  }

  static complete($button) {
    const defaultText = $button.data('defaultText');

    $button
      .removeClass('progress')
      .attr('disabled', false)
      .find('.button-text')
      .text(defaultText);
  }
}
