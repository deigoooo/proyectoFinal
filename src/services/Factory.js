import config from "../config/config.js";
import {
  ProductService,
  CartService,
  MessageService,
  TicketService,
  UserService,
} from "./Services.js";
import ProductMongoDao from "../dao/product.mongo.dao.js";
import CartMongoDao from "../dao/cart.mongo.dao.js";
import MessageMongoDao from "../dao/message.mongo.dao.js";
import TicketMongoDao from "../dao/ticket.mongo.dao.js";
import UserMongoDao from "../dao/user.mongo.dao.js";

let daoProduct;
let daoCart;
let daoMessage;
let daoTicket;
let daoUser;

switch (config.app.persistence) {
  case "MONGO":
    daoProduct = new ProductMongoDao();
    daoCart = new CartMongoDao();
    daoMessage = new MessageMongoDao();
    daoTicket = new TicketMongoDao();
    daoUser = new UserMongoDao();
    break;

  default:
    break;
}

export const productService = new ProductService(daoProduct);
export const cartService = new CartService(daoCart);
export const messageService = new MessageService(daoMessage);
export const ticketService = new TicketService(daoTicket);
export const userService = new UserService(daoUser);
