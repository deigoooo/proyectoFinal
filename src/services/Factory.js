import config from "../config/config.js";
import { ProductService, CartService } from "./Services.js";
import ProductMongoDao from "../dao/product.mongo.dao.js";
import CartMongoDao from "../dao/cart.mongo.dao.js";

let daoProduct;
let daoCart;

switch (config.app.persistence) {
  case "MONGO":
    daoProduct = new ProductMongoDao();
    daoCart = new CartMongoDao();
    break;

  default:
    break;
}

export const productService = new ProductService(daoProduct);
export const cartService = new CartService(daoCart);
