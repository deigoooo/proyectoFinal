export class PaymentDTO {
    constructor(product,title, price, quantity) {
      this.title = title;
      this.unit_price = price;
      this.quantity = quantity;
      /* this._id = user._id || user.id || null;
      this.carts = user.carts.cart._id || {};
      this.first_name = user.first_name || "";
      this.last_name = user.last_name || "";
      this.email = user.email || "";
      this.tickets = user.tickets || [];
      this.role = user.role; */
    }
  }