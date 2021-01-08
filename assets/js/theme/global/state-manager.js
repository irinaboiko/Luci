import stateCountry from './state-country';
import SelectWrapper from './select-wrapper';

export default class StateManager {
  constructor(options) {
    this.$el = $(options.el);
    this.context = options.context;

    this._registerFormValidator(this.$el);
  }

  _registerFormValidator() {
    const $stateElement = $('[data-field-type="State"]');

    if ($stateElement) {
      // Requests the states for a country with AJAX
      stateCountry($stateElement, this.context, { useIdForStates: true }, (err) => {
        if (err) {
          throw new Error(err);
        } else {
          const $select = $('.form-select[data-field-type="State"]');
          new SelectWrapper($select);
        }
      });
    }
  }
}
