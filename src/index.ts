import './scss/styles.scss';

import { Api, ApiPostMethods, ApiListResponse } from './components/base/api'
import { API_URL, CDN_URL } from './utils/constants';

const api = new Api(API_URL);

api.get('/product/').then((data) => {
  console.log(data);
});