export default class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.carts = user.carts.cart._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }
}
