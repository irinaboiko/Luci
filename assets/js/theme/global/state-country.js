import utils from '@bigcommerce/stencil-utils';
import _ from 'lodash';
import ErrorAlert from '../utils/error-alert';

function getFieldId($field) {
  const fieldId = $field.prop('name').match(/(\[.*\])/);

  if (fieldId && fieldId.length !== 0) {
    return fieldId[0];
  }
}

/**
 * Insert hidden field after State/Province field
 * @param {object} $stateField JQuery field object
 */
function insertStateHiddenField($stateField) {
  const fieldId = getFieldId($stateField);
  const stateFieldAttrs = {
    type: 'hidden',
    name: `FormFieldIsText${fieldId}`,
    value: '1',
  };

  $stateField.after($('<input />', stateFieldAttrs));
}

/**
 * If the selected country doesn't have any provice data, show a text input
 * @returns {jQuery|HTMLElement}
 */
function makeStateRequired(stateElement) {
  const attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
    result[item.name] = item.value;
    return result;
  });

  const replacementAttributes = {
    id: attrs.id,
    'data-label': attrs['data-label'],
    class: 'form-select',
    name: attrs.name,
    'data-field-type': attrs['data-field-type'],
  };

  stateElement.replaceWith($('<select></select>', replacementAttributes));

  const $newElement = $('[data-field-type="State"]');
  const $hiddenInput = $('[name*="FormFieldIsText"]');

  $hiddenInput.remove();

  //TODO: whether or not the field is required needs to be updated as well, look at stencil.

  return $newElement;
}

/**
 * If the selected country has states, show a select input
 */
function makeStateOptional(stateElement) {

  const attrs = _.transform(stateElement.prop('attributes'), (result, item) => {
    result[item.name] = item.value;
    return result;
  });

  const replacementAttributes = {
    type: 'text',
    id: attrs.id,
    'data-label': attrs['data-label'],
    class: 'form-input',
    name: attrs.name,
    'data-field-type': attrs['data-field-type'],
  };

  stateElement.closest('.select-wrapper').replaceWith($('<input />', replacementAttributes));

  const $newElement = $('[data-field-type="State"]');

  if ($newElement.length) {
    insertStateHiddenField($newElement);
  }

  return $newElement;
}

/**
 * Adds the array of options from the remote request to the newly created select box.
 * @param statesArray
 * @param $selectElement
 */
function addOptions(statesArray, $selectElement, options) {
  const container = [];
  container.push(`<option value="">${statesArray.prefix}</option>`);
  if (!_.isEmpty($selectElement)) {
    _.each(statesArray.states, (stateObj)  => {
      if (options.useIdForStates) {
        container.push(`<option value="${stateObj.id}">${stateObj.name}</option>`);
      } else {
        container.push(`<option value="${stateObj.name}">${stateObj.name}</option>`);
      }
    });
    $selectElement.html(container.join(' '));
  }
}

export default function (stateElement, context, options, callback) {
  context = context || {};
  const errorAlert = new ErrorAlert();

  $('select[data-field-type="Country"]').on('change', (event) => {
    const countryName = $(event.currentTarget).val();

    if (countryName === '') {
      return;
    }

    utils.api.country.getByName(countryName, (err, response) => {
      if (err) {
        errorAlert.open(context.state_error, 'get-by-name-error');
        return callback(err);
      }

      const $currentInput = $('[data-field-type="State"]');

      if (!_.isEmpty(response.data.states)) {
        // The element may have been replaced with a select, reselect it
        const $selectElement = makeStateRequired($currentInput);
        addOptions(response.data, $selectElement, options);
        callback(null, $selectElement);

      } else {
        const $newElement = makeStateOptional($currentInput);
        callback(null, $newElement);
      }
    });
  });
}
