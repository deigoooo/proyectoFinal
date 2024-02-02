import cartModel from "../models/cart.model.js";

export default class CartMongoDao {
  constructor() {}
  getAll = async () => await cartModel.find().lean().exec();
  getById = async (id) => await cartModel.findById(id).lean().exec();
  create = async (data) => {
    try {
      const response = await cartModel.create(data);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  delete = async (id) => {
    try {
      const response = await cartModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  update = async (id, data) => {
    try {
      const result = await cartModel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
      if (result === null) {
        return `[ERROR]: ${id} does not exist`;
      }
      return result;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
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
  getProductsFromCart = async (req, res) => {
    try {
      const id = req.params.cid;
      const result = await cartModel
        .findById(id)
        .populate("products.product")
        .lean();
      if (result === null) {
        return {
          statusCode: 404,
          response: { status: "error", error: "Not found" },
        };
      }
      return {
        statusCode: 200,
        response: { status: "success", payload: result },
      };
    } catch (error) {
      return {
        statusCode: 500,
        response: { status: "error", error: error.message },
      };
    }
  };
  getProductsFromCartForOnWire = async (cid) => {
    try {
      const result = await cartModel
        .findById(cid)
        .populate("products.product")
        .lean();
      if (result === null) {
        return {
          statusCode: 404,
          response: { status: "error", error: "Not found" },
        };
      }
      return {
        statusCode: 200,
        response: { status: "success", payload: result },
      };
    } catch (error) {
      return {
        statusCode: 500,
        response: { status: "error", error: error.message },
      };
    }
  };
}
