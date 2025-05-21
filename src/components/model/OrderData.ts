import { IItem, IOrder, PaymentMethod } from "../../types";


class OrderData {
  protected order: IOrder = {
    payment: "online",
    email: "",
    phone: "",
    address: "",
  }

  set payment(payment: PaymentMethod) {
    this.order.payment = payment;
  }

  set email(email: string) {
    this.order.email = email;
  }

  set phone(phone: string | number) {
    this.order.phone = String(phone);
  }

  set address(address: string) {
    this.order.address = address;
  }

  get orderData(): IOrder {
    return this.order;
  }

  validateOrder(): boolean {
    return 
  }

  clearOrder(): void {
    this.order = {
      payment: "online",
      email: "",
      phone: "",
      address: "",
    };
  }
 }