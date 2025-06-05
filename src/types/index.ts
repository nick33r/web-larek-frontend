// --------- Модель данных ---------
// Интерфейс объекта товара

export interface IItem {
  id: string,
  title: string,
  price: number | null,
  image: string,
  description: string,
  category: string,
}

// Интерфейс модели данных заказа

export type PaymentMethod = "online" | "cash"

export interface IOrder {
  payment: PaymentMethod,
  email: string,
  phone: string | number,
  address: string,
}

// Интерфейс объекта заказа для API

export interface IOrderApi extends IOrder {
  total: number | null,
  items: string[],
}

// --------- Типы представления ---------
// Представление страницы

export interface IPage {
  counter: number;
  gallery: HTMLElement[];
  locked: boolean;
}

// Модальное окно

export interface IModalData {
  content: HTMLElement;
}

// Интерфейс для представления карточек товаров

export type Category = "другое" | "софт-скил" | "дополнительное" | "кнопка" | "хард-скил";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  title: string;
  price: number;
  description?: string | string[];
  image?: string;
  category?: T;
}

// Интерфейс для представления форм 

export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Интерфейсы для представления окна успешного заказа

export interface ISuccess {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

// Интерфейс для представления корзины

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}