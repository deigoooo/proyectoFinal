import productModel from "../models/product.model.js";

class ProductManager {
  constructor() {}

  async paginate(filterOption, paginateOption) {
    try {
      const response = await productModel.paginate(
        filterOption,
        paginateOption
      );
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async getProduct() {
    try {
      //el lean es para no tener problemas con handlebars
      const response = await productModel.find().lean();
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
    try {
      const result = await productModel.findByIdAndUpdate(id, updateProduct, {
        returnDocument: "after",
      });
      if (result === null) {
        return `[ERROR]: ${id} does not exist`;
      }
      return result;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
}

export default ProductManager;
