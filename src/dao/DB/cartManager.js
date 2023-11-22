import cartModel from "../models/cart.model.js";

class CartManager {
  constructor() {}

  async getAll() {
    try {
      const response = await cartModel.find();
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async getById(id) {
    try {
      const response = await cartModel.findOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async create() {
    try {
      const response = await cartModel.create({ products: [] });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      const productIndex = cart.products.findIndex(
        (element) => element.product == pid
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
      const response = await cartModel.findByIdAndUpdate(cid, cart, {
        returnDocument: "after",
      });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async delete(id) {
    try {
      const response = await cartModel.deleteOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cartToUpdate = await cartModel.findById(cid);
      const productIndex = cartToUpdate.products.findIndex(
        (element) => element.product == pid
      );
      if (productIndex === -1) {
        return `[ERROR]: Id product ${pid} does not found in the cart Id: ${cid}`;
      } else {
        cartToUpdate.products = cartToUpdate.products.filter(
          (element) => element.product.toString() !== pid
        );
      }
      const response = await cartModel.findByIdAndUpdate(cid, cartToUpdate, {
        returnDocument: "after",
      });

      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }

  async update(id, newCart) {
    try {
      const result = await cartModel.findByIdAndUpdate(id, newCart, {
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

export default CartManager;
