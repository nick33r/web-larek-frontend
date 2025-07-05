import { IFormState, IOrder, PaymentMethod } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "./Component";

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
      super(container);

      this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
      this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

      this.container.addEventListener('input', (e: Event) => {
          const target = e.target as HTMLInputElement;
          const field = target.name as keyof T;
          const value = target.value;
          this.onInputChange(field, value);
      });

      this.container.addEventListener('submit', (e: Event) => {
          e.preventDefault();
          this.events.emit(`${this.container.name}:submit`);
      });
  }

  protected onInputChange(field: keyof T, value: string) {
      this.events.emit(`${this.container.name}.${String(field)}:change`, {
          field,
          value
      });
  }

  set valid(value: boolean) {
      this._submit.disabled = !value;
  }

  set errors(value: string) {
      this.setText(this._errors, value);
  }

  render(state: Partial<T> & IFormState) {
      const {valid, errors, ...inputs} = state;
      super.render({valid, errors});
      Object.assign(this, inputs);
      return this.container;

  }
}

export class OrderDeliveryForm extends Form<IOrder> {
  protected _paymentCardButton: HTMLButtonElement;
  protected _paymentCashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentCardButton = container.card;
    this._paymentCashButton = container.cash;
    this._addressInput = container.address;

    this._paymentCardButton.addEventListener('click', () => {
        this.events.emit('order.payment:change', this._paymentCardButton);
        this.toggleClass(this._paymentCardButton, 'button_alt-active', true);
        this.toggleClass(this._paymentCashButton, 'button_alt-active', false);
    });
    this._paymentCashButton.addEventListener('click', () => {
        this.events.emit('order.payment:change', this._paymentCashButton);
        this.toggleClass(this._paymentCardButton, 'button_alt-active', false);
        this.toggleClass(this._paymentCashButton, 'button_alt-active', true);
    });
  }

  set payment(value: PaymentMethod) {
    switch (value) {
      case 'card':
        this._paymentCardButton.click();
        break;
      case 'cash':
        this._paymentCashButton.click();
        break;
      default:
        this.toggleClass(this._paymentCardButton, 'button_alt-active', false);
        this.toggleClass(this._paymentCashButton, 'button_alt-active', false);
        break;
    }
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  get address(): string {
    return this._addressInput.value;
  }
}

export class OrderContactForm extends Form<IOrder> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._emailInput = container.email;
    this._phoneInput = container.phone;
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  get email(): string {
    return this._emailInput.value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  get phone(): string {
    return this._phoneInput.value;
  }

  orderPending(value: boolean) {
    this._emailInput.disabled = value;
    this._phoneInput.disabled = value;
    this._submit.disabled = value;
    this._submit.textContent = value ? 'Обработка...' : 'Оплатить';
  }
}