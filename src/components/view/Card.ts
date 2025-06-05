import { Category, ICard, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "./component";

export class Card extends Component<ICard<Category>> { 
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._price = ensureElement<HTMLElement>(`.card__price`, container);
    this._description = container.querySelector(`.card__text`);
    this._image = container.querySelector(`.card__image`);
    this._category = container.querySelector(`.card__category`);
    this._button = container.querySelector(`.card__button`);
    this._index = container.querySelector(`.basket__item-index`);

    if (actions?.onClick) {
        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            container.addEventListener('click', actions.onClick);
        }
    }
}

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, 'Бесценно');
    } else {
      this.setText(this._price, value);
    }
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
          const descTemplate = this._description.cloneNode() as HTMLElement;
          this.setText(descTemplate, str);
          return descTemplate;
      }));
    } else {
      this.setText(this._description, value);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: Category) {
    this.setText(this._category, value);

    switch (value) {
      case 'другое':
        this.toggleClass(this._category, 'card__category_other', true);
        break;

      case 'софт-скил':
        this.toggleClass(this._category, 'card__category_soft', true);
        break;
    
      case 'дополнительное':
        this.toggleClass(this._category, 'card__category_additional', true);
        break;

      case 'кнопка':
        this.toggleClass(this._category, 'card__category_button', true);
        break;

      case 'хард-скил':
        this.toggleClass(this._category, 'card__category_hard', true);
        break;

      default:
        // по умолчанию другое
        this.toggleClass(this._category, 'card__category_other', true);
        break;
    }
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }
}