import FormValidator from '../utils/FormValidator';

export default class ProductReviews {
  constructor(context) {
    this.context = context;
    this.$body = $(document.body);

    this.$forceOpenModal = $('[data-open-review-initial]');
    this.$openReview = $('[data-open-review-modal]');
    this.$reviewModalWrapper = $('[data-review-modal]');
    this.writeReviewClose = '.write-review-close';
    this.$reviewModalContent = this.$reviewModalWrapper.children('.write-review-content');
    this.$reviewModalSpinner = this.$reviewModalWrapper.find('.page-spinner');
    this.$reviewModalClose = $(this.writeReviewClose);
    this.reviewModalActive = false;

    this.$toggleReview = $('[data-toggle-reviews]');
    this.$reviewContainer = $('[data-review-container]');
    this.toggleActionText = {
      showReviews: this.context.showReviews,
      hideReviews: this.context.hideReviews,
    };

    this.$reviewForm = $('#form-leave-a-review');
    this.validator = new FormValidator(this.context);

    this._productReviewHandler();
    this._bindEvents();
  }

  /**
   * Bind event handlers
   * @private
   */
  _bindEvents() {

    this.validator.initSingle(this.$reviewForm);

    $(window).on('resize', () => {
      if (this.$reviewModalWrapper.is(':visible')) {
        this._positionReviewModal();
      }
    });

    this.$openReview.on('click', (event) => {
      event.preventDefault();
      if (!this.reviewModalActive) {
        this._openReviewModal();
      }
    });

    this.$body.on('keyup', (event) => {
      if (event.keyCode === 27 && this.$reviewModalWrapper.hasClass('visible')) {
        event.preventDefault();
        this._closeReviewModal();
      }
    });

    this.$reviewModalWrapper.on('click', this.writeReviewClose, (event) => {
      event.preventDefault();
      this._closeReviewModal();
    });

    this.$reviewModalWrapper.on('click', (event) => {
      if(this.$reviewModalWrapper.hasClass('visible')){
        if(!$(event.target).closest('.write-review-content').length){
          this._closeReviewModal();
        }
      }
    });

    this.$toggleReview.on('click', (event) => {
      const $button = $(event.target);
      event.preventDefault();

      if (!$button.hasClass('disabled')) {
        this._toggleReviewContainer($button);
      }
      $button.addClass('disabled');
    });

    if (this.$forceOpenModal.length) {
      this.$openReview.trigger('click');
    }
  }

  /**
   * Shows or hides the Review Container
   * @param $button
   * @private
   */
  _toggleReviewContainer($button) {
    if (this.$reviewContainer.hasClass('visible')) {
      // -- Hide Reviews -- //
      this.$reviewContainer.revealer('hide').one('trend', () => {
        this.$reviewContainer.addClass('hidden');
        $button.text(this.toggleActionText.showReviews).removeClass('disabled');
      });

    } else {
      // -- Show Reviews -- //
      this.$reviewContainer.removeClass('hidden').revealer('show').one('trend', () => {
        this.$reviewContainer.trigger('update-layout');
        $button.text(this.toggleActionText.hideReviews).removeClass('disabled');
      });
    }
  }

  _openReviewModal() {
    this.reviewModalActive = true;
    this.$reviewModalSpinner.revealer('show');

    this.$body.addClass('scroll-locked');
    this.$reviewModalWrapper.revealer('show');

    this._showReviewModal();
  }

  _showReviewModal() {
    this.$reviewModalSpinner.revealer('hide').one('trend', () => {
      this._positionReviewModal();
      this.$reviewModalContent.revealer('show');
      this.$reviewModalClose.revealer('show');
    });
  }

  _closeReviewModal() {
    this.$reviewModalContent.revealer('hide').one('trend', () => {
      this.$reviewModalWrapper.revealer('hide');
      this.$reviewModalClose.revealer('hide');
      this.$body.removeClass('scroll-locked');
      this._resetForm();
      this.reviewModalActive = false;
    });
  }

  _resetForm(){
    const toRemove = [];
    toRemove.push(this.$reviewForm.find('.alert-message'));
    toRemove.push(this.$reviewForm.find('.form-inline-message'));
    this.$reviewForm.find('.form-field-error').removeClass('form-field-error');
    for (let i = 0; i < toRemove.length; i++) {
      toRemove[i].remove();
    }
  }

  _positionReviewModal() {
    if (this.reviewModalActive && !this.$body.hasClass('scroll-locked')) {
      this.$body.addClass('scroll-locked');
    }

    this.$reviewModalContent.css({
      marginTop: -(this.$reviewModalContent.outerHeight() / 2),
      marginLeft: -(this.$reviewModalContent.outerWidth() / 2),
    });
  }

  _productReviewHandler() {
    if (location.href.indexOf('#write_review') !== -1) {
      this._openReviewModal();
    }
  }
}
