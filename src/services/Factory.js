import config from "../config/config.js";
import {
  ProductService,
  CartService,
  MessageService,
  TicketService,
} from "./Services.js";
import ProductMongoDao from "../dao/product.mongo.dao.js";
import CartMongoDao from "../dao/cart.mongo.dao.js";
import MessageMongoDao from "../dao/message.dao.js";
import TicketMongoDao from "../dao/ticket.dao.mongo.js";

let daoProduct;
let daoCart;
let daoMessage;
let daoTicket;

switch (config.app.persistence) {
  case "MONGO":
    daoProduct = new ProductMongoDao();
    daoCart = new CartMongoDao();
    daoMessage = new MessageMongoDao();
    daoTicket = new TicketMongoDao();
    break;

  default:
    break;
}

export const productService = new ProductService(daoProduct);
export const cartService = new CartService(daoCart);
export const messageService = new MessageService(daoMessage);
export const ticketService = new TicketService(daoTicket);
