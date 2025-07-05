import './scss/styles.scss';
// !! Удалить из документации описание того, что классы модели данных наследуют Model

import { LarekAPI } from './components/base/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { BaseItems, BasketItems } from './components/model/Items';
import { Category, IApiGet, IItem, IOrderApi, ISuccessAPI, PaymentMethod } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { OrderData } from './components/model/OrderData';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { OrderContactForm, OrderDeliveryForm } from './components/view/Form';
import { Success } from './components/view/Success';

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
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Данные
const catalogData = new BaseItems(events);
const basketData = new BasketItems(events);
const orderData = new OrderData();

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const deliveryForm = new OrderDeliveryForm(cloneTemplate(orderTemplate), events);
const contactForm = new OrderContactForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
		onClick: () => {
			events.emit('modal:close')
			modal.close();
		}
})


function renderBasket() {
	return basket.render({
			items: basketData.getItems().map(item => {
					const card = new Card(cloneTemplate(cardBasketTemplate), {
							onClick: () => events.emit('card:toggle', item)
					});
					return card.render({
							id: item.id,
							title: item.title,
							price: item.price,
							index: basketData.getItems().indexOf(item) + 1
					});
			}),
			total: basketData.getTotalPrice()
	});
};

function getOrderData(): IOrderApi {
	const { payment, email, phone, address } = orderData.orderData;
	return {
		payment,
		email,
		phone,
		address,
		total: basketData.getTotalPrice(),
		items: basketData.getItemsId()
	}
};

// ---------- Обработка событий ----------

// Изменились элементы каталога

events.on('items:changed', () => {
	page.gallery = catalogData.getItems().map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item)
		});
		return card.render({
			id: item.id,
			category: item.category,
			title: item.title,
			image: `${CDN_URL}${item.image}`,
			price: item.price,
		})
	});
});

events.on('card:select', (item: IItem) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toggle', item)
			events.emit('card:select', item)
		}
	});

	let buttonState = 'В корзину';
	if (item.price === null) {
		buttonState = 'Не для продажи';
	} else if (basketData.checkItem(item.id)) {
		buttonState = 'Удалить';
	}

	modal.render({
		content: cardPreview.render({
			id: item.id,
			category: item.category,
			description: item.description,
			title: item.title,
			image: `${CDN_URL}${item.image}`,
			price: item.price,
			button: buttonState
		})
	});
});

events.on('card:toggle', (item: IItem) => {
	basketData.toggleItem(item);
	renderBasket();
});

events.on('basket:changed', () => {
	page.counter = basketData.getItems().length;
});

events.on('basket:open', () => {
	modal.render({
		content: renderBasket()
	});
});

events.on('order:open', () => {
	modal.render({
		content: deliveryForm.render({
			valid: true,
			errors: ""
		})
	})
});

events.on('order.payment:change', (button: HTMLButtonElement) => {
	orderData.payment = button.name as PaymentMethod;
});

events.on(/^order\..*:change/, () => {
	deliveryForm.valid = true;
	deliveryForm.errors = "";
});

events.on('order:submit', () => {
	orderData.address = deliveryForm.address;
	const { payment, address } = orderData.orderData;

	let error = "";
	if (!payment && !address) {
    error = "Выберите способ оплаты и укажите адрес доставки";
  } else if (!payment) {
    error = "Выберите способ оплаты";
  } else if (!address) {
    error = "Необходимо указать адрес";
  }

	const formValid = payment && address;

	modal.render({
		content: formValid
			? contactForm.render({ valid: true, errors: "" })
			: deliveryForm.render({ valid: false, errors: error })
	})
});

events.on(/^contacts\..*:change/, () => {
	contactForm.valid = true;
	contactForm.errors = "";
});

events.on('contacts:submit', () => {
	orderData.email = contactForm.email;
	orderData.phone = contactForm.phone;
	const { email, phone } = orderData.orderData;

	let error = "";
	if (!email && !phone) {
		error = "Укажите ваш email и телефон";
	} else if (!email) {
		error = "Необходимо указать ваш email";
	} else if (!phone) {
		error = "Необходимо указать ваш телефон";
	}

	const formValid = orderData.validateOrder();
	contactForm.orderPending(formValid);

	!formValid
		? modal.render({
				content: contactForm.render({ valid: false, errors: error })
	})
		: api.postOrder(getOrderData())
			.then((data: ISuccessAPI) => {
				contactForm.orderPending(false);
				modal.render({
					content: success.render({
						total: data.total
					})
				});
				basketData.clear();
			})
			.catch((error) => {
				contactForm.orderPending(false);
				contactForm.errors = "Не получилось сделать заказ - попробуйте позже";
				console.log(error);
			})
})










events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getProductList()
	.then((data: IApiGet) => {
		catalogData.setItems(data.items);
	})
	.catch(error => console.log(error))

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

// catalogData.setItems(mockItems);

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