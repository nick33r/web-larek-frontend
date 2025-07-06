// --------- Модель данных ---------
// Интерфейс объекта товара

export type Category = "другое" | "софт-скил" | "дополнительное" | "кнопка" | "хард-скил";

export interface IItem {
  id: string,
  title: string,
  price: number | null,
  image: string,
  description: string,
  category: Category,
}

// Интерфейс модели данных заказа

export type PaymentMethod = "card" | "cash" | undefined;

export interface IOrder {
  payment: PaymentMethod,
  email: string,
  phone: string | number,
  address: string,
}

// Интерфейс полученных данных от API

export interface IApiGet {
  total: number;
  items: IItem[];
}

// Интерфейс объекта заказа для API

export interface IOrderApi extends IOrder {
  payment: PaymentMethod,
  email: string,
  phone: string | number,
  address: string,
  total: number,
  items: string[]
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

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  id: string;
  title: string;
  price: number;
  description?: string | string[];
  image?: string;
  category?: T;
  index?: number;
  button?: string;
}

// Интерфейс для представления форм 

export interface IFormState {
  valid: boolean;
  errors: string;
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

// Интерфейс ответа сервера об успешном заказе

export interface ISuccessAPI {
  id: string;
  total: number;
}