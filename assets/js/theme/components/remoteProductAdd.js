import ProductUtils from '../product/product-utils';

export default class RemoteProductAdd {
  constructor(context){
    this.context = context;

    const $buttons = $('[data-product-add-to-cart]');
    ProductUtils.bindRemoteAdd(this.context, $buttons);
  }

}
