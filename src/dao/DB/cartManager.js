import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";

const uri = "mongodb://0.0.0.0:27017";

try {
  await mongoose.connect(uri, {
    dbName: "ecommerce",
  });
} catch (error) {
  console.log(error);
}

class CartManager {
  constructor() {}
  async getCart() {
    const response = await cartModel.find();
    return response;
  }

  async getCartById(id) {
    try {
      const response = await cartModel.findOne({ _id: id });
      return response;
    } catch (error) {
      return "[ERROR] El Id no existe";
    }
  }

  async addCart() {
    const response = await cartModel.create({ products: [] });
    return response;
  }
}

export default CartManager;
