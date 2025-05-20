import {IItem} from "../../types/index";

export abstract class Items<IItem> {
  items: IItem[] = [];

  constructor(data?: Partial<IItem>) {
    Object.assign(this, data);
  }

  getItem(id: string): IItem {
    return this.items.find(item => item.id === id);
  }

  getItems(): IItem[] {
    return this.items;
  }

  setItems(items: IItem[]): void {
    this.items = items;
  }
}

export class BaseItems extends Items<IItem> {}

export class BasketItems extends Items<IItem> {
  toggleItem(item: IItem): void {
    this.items = this.items.filter(i => i.id !== item.id);
  }

  getTotalPrice(): number | null {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  getItemsId(): string[] {
    return this.items.map(item => item.id);
  }

  checkItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }

  // deleteItem(id: string): void { }

  clear(): void {
    this.items = [];
  }
}