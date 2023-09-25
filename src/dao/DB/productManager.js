import mongoose from "mongoose";
import productModel from "../models/product.model.js";

class ProductManager {
  constructor() {}

  async getProduct() {
    try {
      const response = await productModel.find();
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async getProductById(id) {
    try {
      const response = await productModel.findOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async addProduct(product) {
    try {
      const response = await productModel.create(product);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async deleteProduct(id) {
    try {
      const response = await productModel.deleteOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async updateProduct(id, updateProduct) {
    console.log(updateProduct);
    try {
      await productModel.updateOne({ _id: id }, updateProduct);

      const newProduct = await productModel.findOne({ _id: id });
      return newProduct;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
}

export default ProductManager;
