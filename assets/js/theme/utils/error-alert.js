import Modal from 'bc-modal';

export default class ErrorAlert {
  constructor() {
  }

  open(error, instance) {
    if (!$(`#modal-${instance}`).length) {
      //eslint-disable-next-line valid-typeof
      const errorMessage = (typeof error === 'array' ? error.join('\n') : error);
      $('.error-message-modal').html(`<div class='error-message'>${errorMessage}</div>`);

      this.errorModal = new Modal({
        el: '.error-message-modal',
        modalId: `modal-${instance}`,
      });

      return this.errorModal.open();
    }else {
      return false;
    }
  }
}
