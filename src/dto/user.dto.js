export class UserDTO {
  constructor(user) {
    this._id = user._id || user.id || null;
    this.carts = user.carts.cart._id || {};
    this.first_name = user.first_name || "";
    this.last_name = user.last_name || "";
    this.email = user.email || "";
    this.tickets = user.tickets || [];
    this.role = user.role;
  }
}

export class UserGetDTO {
  constructor(user) {
    this._id = user._id || user.id || null;
    this.first_name = user.first_name || "";
    this.last_name = user.last_name || "";
    this.email = user.email || "";
    this.role = user.role;
  }
}
