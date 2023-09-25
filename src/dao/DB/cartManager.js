import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

class CartManager {
  constructor() {}
  async getCart() {
    try {
      const response = await cartModel.find();
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async getCartById(id) {
    try {
      const response = await cartModel.findOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async addCart() {
    try {
      const response = await cartModel.create({ products: [] });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async deleteCart(id) {
    try {
      const response = await cartModel.deleteOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      const product = await productModel.findOne({ _id: pid });
      cart.products.push({ product: product._id });
      await cartModel.updateOne({ _id: cid }, cart);
      const newCart = cartModel
        .findOne({ _id: cid })
        .populate("products.product");
      return newCart;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
}

export default CartManager;
