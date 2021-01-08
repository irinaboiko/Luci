import CoreGiftCertificate from './core/GiftCertificate';
import SelectWrapper from './global/select-wrapper';

export default class GiftCertificate extends CoreGiftCertificate {
  selectWrapCallback($selectEl) {
    // -- This select bubbles up from /core/Account.js -- //
    new SelectWrapper($selectEl);
  }
}
