import { Repository } from "./Repository.js";

export class ProductService extends Repository {
  constructor(dao) {
    super(dao);
  }
  getAllPaginate = async (req, PORT) =>
    await this.dao.getAllPaginate(req, PORT);
}

export class CartService extends Repository {
  constructor(dao) {
    super(dao);
  }
  addProductToCart = async (cid, pid) =>
    await this.dao.addProductToCart(cid, pid);
  deleteProductFromCart = async (cid, pid) =>
    await this.dao.deleteProductFromCart(cid, pid);
  getProductsFromCart = async (req, res) =>
    await this.dao.getProductsFromCart(req, res);
  getProductsFromCartForOnWire= async(cid)=>
    await this.dao.getProductsFromCartForOnWire(cid);
}
export class MessageService extends Repository {
  constructor(dao) {
    super(dao);
  }
}
export class TicketService extends Repository {
  constructor(dao) {
    super(dao);
  }
  getProductsFromTicket = async (id) => {
    await this.dao.getProductsFromTicket(id);
  };
}

export class UserService extends Repository {
  constructor(dao) {
    super(dao);
  }
  deletePerDate = async () => await this.dao.deletePerDate();
}
