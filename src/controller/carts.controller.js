import {
  cartService,
  productService,
} from "../services/Factory.js";
import CustomError from "../services/errors/custom_error.js";
import EError from "../services/errors/enums.js";
import { generateCartsErrorInfo } from "../services/errors/info.js";
import {payment} from "../services/payment.services.js";


export const getCartsController = async (req, res, next) => {
  try {
    const carts = await cartService.getAll();
    res.status(200).json({ status: "succes", payload: carts });
  } catch (error) {
    next(error);
  }
};

export const getCartController = async (req, res, next) => {
  try {
    const result = await cartService.getProductsFromCart(req, res);
    res.status(result.statusCode).json(result.response);
  } catch (error) {
    next(error);
  }
};

export const updateCartController = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cartToUpdate = await cartService.getById(cid);
    if (cartToUpdate === null) {
      /* return res.status(404).json({ status: "error", error: cartToUpdate }); */
      throw CustomError.createError({
        name: "Update Cart error",
        cause: generateCartsErrorInfo(cid),
        message: `ID: ${cid} does not exist`,
        code: EError.DATABASES_ERROR,
      });
    }
    const products = req.body.products;
    if (!products) {
      /* return res
        .status(400)
        .json({ status: "error", error: 'Field "products" is not optional' }); */
      throw CustomError.createError({
        name: "Update Cart error",
        cause: generateCartsErrorInfo(products),
        message: 'Field "products" is not optional',
        code: EError.BODY_EMPTY,
      });
    }
    for (let index = 0; index < products.length; index++) {
      if (
        !products[index].hasOwnProperty("product") ||
        !products[index].hasOwnProperty("quantity")
      ) {
        /* return res.status(400).json({
          status: "error",
          error: "product must have a valid id and a valid quantity",
        }); */
        throw CustomError.createError({
          name: "Update Cart error",
          cause: generateCartsErrorInfo(products),
          message: "product must have a valid id and a valid quantity",
          code: EError.INVALID_TYPES_ERROR,
        });
      }
      if (typeof products[index].quantity !== "number") {
        /* return res.status(400).json({
          status: "error",
          error: "product's quantity must be a number",
        }); */
        throw CustomError.createError({
          name: "Update Cart error",
          cause: generateCartsErrorInfo(products[index].quantity),
          message: "product's quantity must be a number",
          code: EError.INVALID_TYPES_ERROR,
        });
      }
      if (products[index].quantity === 0) {
        /* return res
          .status(400)
          .json({ status: "error", error: "product's quantity cannot be 0" }); */
        throw CustomError.createError({
          name: "Update Cart error",
          cause: generateCartsErrorInfo(products[index].quantity),
          message: "product's quantity cannot be 0",
          code: EError.INVALID_TYPES_ERROR,
        });
      }
      //ver esta linea aplicar servicios
      const productToAdd = await productService.getById(
        products[index].product
      );
      if (productToAdd === null) {
        /* return res.status(400).json({
          status: "error",
          error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}`,
        }); */
        throw CustomError.createError({
          name: "Update Cart error",
          cause: generateCartsErrorInfo(products),
          message: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}`,
          code: EError.DATABASES_ERROR,
        });
      }
    }
    cartToUpdate.products = products;
    const result = await cartService.update(cid, cartToUpdate);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export const updateProductOnCartController = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartToUpdate = await cartService.getById(cid);
    if (cartToUpdate === null) {
      /* return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(cid),
        message: `Cart with id=${cid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    const productToUpdate = await productService.getById(pid);
    if (productToUpdate === null) {
      /* return res
        .status(404)
        .json({ status: "error", error: `Product with id=${pid} Not found` }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(pid),
        message: `Product with id=${pid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    const quantity = req.body.quantity;
    if (!quantity) {
      /* return res
        .status(400)
        .json({ status: "error", error: 'Field "quantity" is not optional' }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(quantity),
        message: 'Field "quantity" is not optional',
        code: EError.BODY_EMPTY,
      });
    }
    if (typeof quantity !== "number") {
      /* return res.status(400).json({
        status: "error",
        error: "product's quantity must be a number",
      }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(quantity),
        message: "product's quantity must be a number",
        code: EError.INVALID_TYPES_ERROR,
      });
    }
    if (quantity === 0) {
      /* return res
        .status(400)
        .json({ status: "error", error: "product's quantity cannot be 0" }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(quantity),
        message: "product's quantity cannot be 0",
        code: EError.INVALID_TYPES_ERROR,
      });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex === -1) {
      /* return res.status(400).json({
        status: "error",
        error: `Product with id=${pid} Not found in Cart with id=${cid}`,
      }); */
      throw CustomError.createError({
        name: "Update Product On Cart error",
        cause: generateCartsErrorInfo(pid),
        message: `Product with id=${pid} Not found in Cart with id=${cid}`,
        code: EError.DATABASES_ERROR,
      });
    } else {
      cartToUpdate.products[productIndex].quantity = quantity;
    }
    const result = await cartService.update(cid, cartToUpdate);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export const addCartController = async (req, res, next) => {
  try {
    const newCart = await cartService.create();
    if (typeof newCart === "string") {
      /* return res
        .status(404)
        .json({ status: "error", error: `${newcart.message}` }); */
      throw CustomError.createError({
        name: "Add Cart error",
        cause: generateCartsErrorInfo(newCart),
        message: `${newCart.message}`,
        code: EError.DATABASES_ERROR,
      });
    }
    res.status(200).json({ status: "success", payload: newCart });
  } catch (error) {
    next(error);
  }
};

export const addProductToCartController = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cartToUpdate = await cartService.getById(cid);
    if (cartToUpdate === null) {
      throw CustomError.createError({
        name: "Add Product to Cart error",
        cause: generateCartsErrorInfo(cid),
        message: `Cart with id=${cid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }

    const productToAdd = await productService.getById(pid);
    if (productToAdd === null) {
      throw CustomError.createError({
        name: "Add Product to Cart error",
        cause: generateCartsErrorInfo(pid),
        message: `Product with id=${pid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    if (productToAdd.owner === req.session.user.email) {
      throw CustomError.createError({
        name: "Add Product to Cart error",
        cause: generateCartsErrorInfo(pid),
        message: `Product with owner=${req.session.user.email} cant add the own product`,
        code: EError.DATABASES_ERROR,
      });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex > -1) {
      cartToUpdate.products[productIndex].quantity += 1;
    } else {
      cartToUpdate.products.push({ product: pid, quantity: 1 });
    }
    const result = await cartService.update(cid, cartToUpdate);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export const deleteCartController = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const find = await cartService.getById(cid);
    if (find === null) {
      throw CustomError.createError({
        name: "Delete Cart error",
        cause: generateCartsErrorInfo(cid),
        message: `Cart with id=${cid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    find.products = [];
    const newCart = await cartService.update(cid, find);
    res.status(200).json({ status: "success", payload: newCart });
  } catch (error) {
    next(error);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartService.deleteProductFromCart(cid, pid);
    if (typeof result === "string") {
      throw CustomError.createError({
        name: "Delete Product from Cart error",
        cause: generateCartsErrorInfo(cid),
        message: `Cart with id=${cid} or Product with id=${pid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export const purchaseController = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    const cartToPurchase = await cartService.getById(cid);
    if (cartToPurchase === null) {
      throw CustomError.createError({
        name: "Purchase error",
        cause: generateCartsErrorInfo(cid),
        message: `Cart with id=${cid} Not found`,
        code: EError.DATABASES_ERROR,
      });
    }
    let productsToTicket = [];

    for (let index = 0; index < cartToPurchase.products.length; index++) {
      const productToPurchase = await productService.getById(
        cartToPurchase.products[index].product
      );
      if (productToPurchase === null) {
        throw CustomError.createError({
          name: "Purchase error",
          cause: generateCartsErrorInfo(cid),
          message: `Product with id=${cartToPurchase.products[index].product} does not exist. We cannot purchase this product`,
          code: EError.DATABASES_ERROR,
        });
      }
      if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {

        //colocamos el producto en el Ticket (en memoria)
        productsToTicket.push({
          product: productToPurchase._id,
          description: productToPurchase.description,
          title: productToPurchase.title,
          price: productToPurchase.price,
          quantity: cartToPurchase.products[index].quantity,
        });
      }
    }
    const respone = await payment(productsToTicket,cid);

    return res.status(200).json({ status: "success", payload: respone });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {};

