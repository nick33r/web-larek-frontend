import './scss/styles.scss';

import { LarekAPI } from './components/base/LarekAPI';
import { CDN_URL } from './utils/constants';
import { BaseItems, BasketItems } from './components/model/Items';
import { IApiGet, IItem, ISuccessAPI, PaymentMethod } from './types';
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

// Мониторинг всех событий - для отладки (чтобы включить - нужно раскомментировать)
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

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
});

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

// Нажали на карточку в каталоге

events.on('card:select', (item: IItem) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toggle', item)
			cardPreview.button = basketData.checkItem(item.id) ? 'Удалить' : 'В корзину';
		}
	});

	const buttonState = item.price === null 
    ? 'Недоступно' 
    : basketData.checkItem(item.id) 
      ? 'Удалить' 
      : 'В корзину';

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

// Нажали на кнопку добавления/удаления карточки

events.on('card:toggle', (item: IItem) => {
	basketData.toggleItem(item);
});

// Изменились элементы в корзине

events.on('basket:changed', () => {
	page.counter = basketData.getItems().length;
	basket.render({
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
});

// Нажали на значок корзины

events.on('basket:open', () => {
	modal.render({
		content: basket.render()
	});
});

// Нажали на кнопку оформления заказа в корзине

events.on('order:open', () => {
	modal.render({
		content: deliveryForm.render({
			valid: orderData.validateDeliveryData(),
			errors: ""
		})
	})
});

// Нажали на кнопку выбора способа оплаты

events.on('order.payment:change', (button: HTMLButtonElement) => {
	orderData.payment = button.name as PaymentMethod;
	deliveryForm.payment = orderData.payment;
});

// Переключили способ оплаты или изменили значение инпута в первой форме

events.on(/^order\..*:change/, () => {
	if (orderData.validateDeliveryData()) {
		deliveryForm.valid = true;
		deliveryForm.errors = "";
	}
});

// Нажали на кнопку отправки первой формы

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
			? contactForm.render({ valid: orderData.validateOrder(), errors: "" })
			: deliveryForm.render({ valid: false, errors: error })
	})
});

// Изменили значение любого инпута во второй форме

events.on(/^contacts\..*:change/, () => {
	contactForm.valid = true;
	contactForm.errors = "";
});

// Нажали на кнопку отправки второй формы

events.on('contacts:submit', () => {
	orderData.email = contactForm.email;
	orderData.phone = contactForm.phone;
	const { payment, address, email, phone } = orderData.orderData;

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

	formValid
		? api.postOrder({
				payment,
				email,
				phone,
				address,
				items: basketData.getItemsId(),
				total: basketData.getTotalPrice()
		})
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
				contactForm.errors = error;
				console.log(error);
			})
		: modal.render({
				content: contactForm.render({ valid: false, errors: error })
	})
});

// Открыли модальное окно

events.on('modal:open', () => {
	page.locked = true;
});

// Закрыли модальное окно

events.on('modal:close', () => {
	page.locked = false;
});

// ---------- Загрузка данных при инициализации страницы ----------

api.getProductList()
	.then((data: IApiGet) => {
		catalogData.setItems(data.items);
	})
	.catch(error => console.log(error))