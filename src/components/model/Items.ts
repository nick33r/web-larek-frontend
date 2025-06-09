import {IItem} from "../../types/index";
import { IEvents } from "../base/events";

export abstract class Items<T extends IItem> {
  protected items: T[] = [];

  constructor(protected events: IEvents) { }

  getItem(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getItems(): T[] {
    return this.items;
  }

  setItems(items: T[]): void {
    this.items = items;
    this.emitChanges('items:changed');
  }

  emitChanges(event: string, payload?: object) {
    this.events.emit(event, payload ?? {});
}
}

export class BaseItems extends Items<IItem> {}

export class BasketItems extends Items<IItem> {
  toggleItem(item: IItem): void {
    this.checkItem(item.id) ?
    this.items = this.items.filter(i => i.id !== item.id) :
    this.items.push(item);
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