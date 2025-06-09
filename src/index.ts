import './scss/styles.scss';
// !! Удалить из документации описание того, что классы модели данных наследуют Model

import { LarekAPI } from './components/base/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { BaseItems, BasketItems } from './components/model/Items';
import { Category, IItem } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { OrderData } from './components/model/OrderData';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Card } from './components/view/Card';

const events = new EventEmitter();
const api = new LarekAPI();

// Мониторинг всех событий - потом удалить!!!!!!
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Данные
const catalogData = new BaseItems(events);
const basketData = new BasketItems(events);
const orderData = new OrderData();

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// 

events.on('items:changed', () => {
	page.gallery = catalogData.getItems().map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.render({
			category: item.category as Category, // TODO: Убрать as !!!
			title: item.title,
			image: `./images${item.image}`,
			price: item.price,
		})
	});
})


























api.getProductList()
	.then(catalogData.setItems.bind(catalogData))
	.catch(error => console.error(error))

// TODO: Тестируем Api

// const api = new Api(`${API_URL}`);

// const get = api.get('/product/');
// console.log(get);

// const larekApi = new LarekAPI();

// const getProductList = larekApi.getProductList();

// console.log(getProductList);

// larekApi.postOrder({
// 	payment: "online",
//   email: "test@test.ru",
//   phone: "+71234567890",
//   address: "Spb Vosstania 1",
//   total: 2200,
//   items: [
//         "854cef69-976d-4c2a-a18c-2aa45046c390",
//         "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//   ]
// });


// TODO: Тестируем компоненты

// const mockItems: IItem[] = [
// 	{
// 		id: '854cef69-976d-4c2a-a18c-2aa45046c390',
// 		description: 'Если планируете решать задачи в тренажёре, берите два.',
// 		image: '/5_Dots.svg',
// 		title: '+1 час в сутках',
// 		category: 'софт-скил',
// 		price: 750,
// 	},
// 	{
// 		id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
// 		description:
// 			'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
// 		image: '/Shell.svg',
// 		title: 'HEX-леденец',
// 		category: 'другое',
// 		price: 1450,
// 	},
// 	{
// 		id: 'b06cde61-912f-4663-9751-09956c0eed67',
// 		description: 'Будет стоять над душой и не давать прокрастинировать.',
// 		image: '/Asterisk_2.svg',
// 		title: 'Мамка-таймер',
// 		category: 'софт-скил',
// 		price: null,
// 	},
// 	{
// 		id: '412bcf81-7e75-4e70-bdb9-d3c73c9803b7',
// 		description:
// 			'Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.',
// 		image: '/Soft_Flower.svg',
// 		title: 'Фреймворк куки судьбы',
// 		category: 'дополнительное',
// 		price: 2500,
// 	},
// 	{
// 		id: '1c521d84-c48d-48fa-8cfb-9d911fa515fd',
// 		description: 'Если орёт кот, нажмите кнопку.',
// 		image: '/mute-cat.svg',
// 		title: 'Кнопка «Замьютить кота»',
// 		category: 'кнопка',
// 		price: 2000,
// 	},
// 	{
// 		id: 'f3867296-45c7-4603-bd34-29cea3a061d5',
// 		description:
// 			'Чтобы научиться правильно называть модификаторы, без этого не обойтись.',
// 		image: 'Pill.svg',
// 		title: 'БЭМ-пилюлька',
// 		category: 'другое',
// 		price: 1500,
// 	},
// 	{
// 		id: '54df7dcb-1213-4b3c-ab61-92ed5f845535',
// 		description: 'Измените локацию для поиска работы.',
// 		image: '/Polygon.svg',
// 		title: 'Портативный телепорт',
// 		category: 'другое',
// 		price: 100000,
// 	},
// 	{
// 		id: '6a834fb8-350a-440c-ab55-d0e9b959b6e3',
// 		description: 'Даст время для изучения React, ООП и бэкенда',
// 		image: '/Butterfly.svg',
// 		title: 'Микровселенная в кармане',
// 		category: 'другое',
// 		price: 750,
// 	},
// 	{
// 		id: '48e86fc0-ca99-4e13-b164-b98d65928b53',
// 		description: 'Очень полезный навык для фронтендера. Без шуток.',
// 		image: 'Leaf.svg',
// 		title: 'UI/UX-карандаш',
// 		category: 'хард-скил',
// 		price: 10000,
// 	},
// 	{
// 		id: '90973ae5-285c-4b6f-a6d0-65d1d760b102',
// 		description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.',
// 		image: '/Mithosis.svg',
// 		title: 'Бэкенд-антистресс',
// 		category: 'другое',
// 		price: 1000,
// 	},
// ];

// const catalog = new BaseItems();

// catalog.setItems(mockItems);

// console.log(catalog.getItems());
// console.log(catalog.getItem('1c521d84-c48d-48fa-8cfb-9d911fa515fd'));
// console.log('Должно быть undefined:', catalog.getItem('1c521d84-c48d-48f'));
// console.log('---------------------------------------------------------------------------------------');

// const basket = new BasketItems();

// basket.toggleItem(mockItems[2]);
// basket.toggleItem(mockItems[4]);

// console.log(basket.getItems());

// basket.toggleItem(mockItems[4]);

// console.log(basket.getItems());

// basket.toggleItem(mockItems[4]);
// basket.toggleItem(mockItems[5]);
// basket.toggleItem(mockItems[6]);

// console.log(basket.getItems());
// console.log(basket.getTotalPrice());
// console.log(basket.getItemsId());

// basket.clear();
// console.log(basket.getTotalPrice());
// console.log(basket.getItems());
// console.log(basket.getItemsId());