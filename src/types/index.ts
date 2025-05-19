// --------- Модель данных ---------
// Интерфейс модели данных еденицы товара

interface IItem {
  id: string
  title: string
  price: number
  image: string
  description: string
  category: string
}

// Интерфейс модели данных заказа

type PaymentMethod = "online" | "on_delivery"

interface IOrder {
  payment: PaymentMethod,
  email: string,
  phone: string | number,
  address: string,
  total: number | null,
  items: string[],
}

// --------- Типы представления ---------
// Представление страницы

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

// Модальное окно

interface IModalData {
  content: HTMLElement;
}

// Интерфейс для представления карточек товаров

type Category = "другое" | "софт-скил" | "дополнительное" | "кнопка" | "хард-скил";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

interface ICard<T> {
  title: string;
  price: number;
  description?: string | string[];
  image?: string;
  category?: T;
}

// Интерфейс для представления форм 

interface IFormState {
  valid: boolean;
  errors: string[];
}

// Интерфейсы для представления окна успешного заказа

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

// Интерфейс для представления корзины

interface IBasketView {
  items: HTMLElement[];
  total: number;
}