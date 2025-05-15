// ---------------- Базовый код ----------------

import { Api } from "../components/base/api";

type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

class EventEmitter implements IEvents {
  _events: Map<EventName, Set<Subscriber>>;

  constructor() { }

  on<T extends object>(eventName: EventName, callback: (event: T) => void) { }

  off(eventName: EventName, callback: Subscriber) { }

  emit<T extends object>(eventName: string, data?: T) { }

  onAll(callback: (event: EmitterEvent) => void) { }

  offAll() { }

  trigger<T extends object>(eventName: string, context?: Partial<T>) { }
}


class WeblarekAPI extends Api {
  
}










// --------------- Модель данных ----------------

// Гарда для проверки на модель
const isModel = (obj: unknown): obj is Model<any> => {
  return obj instanceof Model;
}

abstract class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) { }

  // Сообщить всем что модель поменялась
  emitChanges(event: string, payload?: object) { }
}

interface IItem {
  id: string
  title: string
  price: number
  image: string
  description: string
  category: string
}

abstract class Items extends Model<IItem> {
  items: IItem[]

  constructor() { }

  getItem(id: string): IItem { }

  getItems(): IItem[] { }

  setItems(items: IItem[]): void { }
}

class BaseItems extends Items { }

class BasketItems extends Items { 
  toggleItem(item: IItem): void { }

  getTotalPrice(): number { }

  getItemsId(): string[] { }

  checkItem(id: string): boolean { }

  deleteItem(id: string): void { }

  clear(): void { }
 }

// Данные пользователя

type PaymentMethod = "online" | "on_delivery"

interface IOrder {
  payment: PaymentMethod,
  email: string,
  phone: string | number,
  address: string,
  total: number | null,
  items: string[],
}

 class OrderData extends Model<IOrder> {
  protected order: IOrder = {
    payment: "online",
    email: "",
    phone: "",
    address: "",
    total: null,
    items: [],
  }

  constructor() {}

  set payment(payment: PaymentMethod) { }

  set email(email: string) { }

  set phone(phone: string | number) { }

  set address(address: string) { }

  set total(total: number) { }

  set itemsId(items: string[]) { }

  set itemsData(items: IItem[]) { }

  get orderData(): IOrder { }

  validateOrder(): boolean { }

  clearOrder(): void { }
 }













//  ---------------- Представления ----------------

abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) { }

  toggleClass(element: HTMLElement, className: string, force?: boolean) { }

  protected setText(element: HTMLElement, value: unknown) { }

  setDisabled(element: HTMLElement, state: boolean) { }

  protected setHidden(element: HTMLElement) { }

  protected setVisible(element: HTMLElement) { }

  protected setImage(element: HTMLImageElement, src: string, alt?: string) { }

  render(data?: Partial<T>): HTMLElement { }
}

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

class Page extends Component<IPage> { 
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
  }

  set counter(value: number) { }

  set catalog(items: HTMLElement[]) { }

  set locked(value: boolean) { }
 }

 interface IModalData {
  content: HTMLElement;
}

class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) { }

  set content(value: HTMLElement) { }

  open() { }

  close() { }

  render(data: IModalData): HTMLElement { }
}

// Карточки

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

class Card extends Component<ICard<Category>> { 
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
  }

  set id(value: string) { }

  get id(): string { }

  set title(value: string) { }

  set price(value: number) { }

  set description(value: string | string[]) { }

  set image(value: string) { }

  set category(value: Category) { }
}

// форма

interface IFormState {
  valid: boolean;
  errors: string[];
}

class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) { }

  protected onInputChange(field: keyof T, value: string) { }

  set valid(value: boolean) { }

  set errors(value: string) { }

  render(state: Partial<T> & IFormState) { }
}

class OrderDeliveryForm extends Form<IOrder> {
  constructor(container: HTMLFormElement, events: IEvents) { }

  set payment(value: PaymentMethod) { }

  set address(value: string) { }
}

class OrderContactForm extends Form<IOrder> {
  constructor(container: HTMLFormElement, events: IEvents) { }

  set email(value: string) { }

  set phone(value: string) { }
}

// Спасибо

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

class Success extends Component<ISuccess> {
  protected _close: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) { }
}

// корзина

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) { }

  set items(items: HTMLElement[]) { }

  set total(total: number) { }
}