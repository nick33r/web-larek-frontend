import { IOrder, PaymentMethod } from "../../types";


export class OrderData {
  protected order: IOrder = {
    payment: undefined,
    email: "",
    phone: "",
    address: "",
  }

  set payment(payment: PaymentMethod) {
    this.order.payment = payment;
  }

  get payment(): PaymentMethod {
    return this.order.payment;
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

  validateDeliveryData(): boolean {
    const { payment, address } = this.order;
    return payment !== undefined && address !== "";
  }

  validateContactsData(): boolean {
    const { email, phone } = this.order;
    return email !== "" && phone !== "";
  }

  validateOrder(): boolean {
    const { payment, address, email, phone } = this.order;
    return (
      payment !== undefined &&
      address !== "" &&
      email !== "" &&
      phone !== ""
    );
  }

  clearOrder(): void {
    this.order = {
      payment: undefined,
      email: "",
      phone: "",
      address: "",
    };
  }
 }