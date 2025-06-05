import { Api } from './api';
import { API_URL, CDN_URL } from '../../utils/constants';
import { IOrderApi } from '../../types';

export class LarekAPI extends Api {
  constructor() {
    super(API_URL);
  }

  getProductList() {
    return this.get('/product/');
  }

  getProductItem(id: string) {
    return this.get(`/product/${id}`);
  }

  postOrder(orderData: IOrderApi) {
    return this.post('/order', orderData);
  }
}