import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
//import CartManager from "../dao/fileSystem/cartManager.js";
import CartManager from "../dao/DB/cartManager.js";
import ProductManager from "../dao/DB/productManager.js";

const router = Router();
const cm = new CartManager(/* "./src/dao/fileSystem/carts.txt" */);
const pm = new ProductManager();

export const getProductsFromCart = async (req, res) => {
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

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const carts = await cm.getCart();
  const newCarts = [];
  if (!limit) {
    res.status(200).json({ status: "succes", payload: carts });
  } else {
    for (let i = 0; i < limit && i < carts.length; i++) {
      newCarts.push(carts[i]);
    }
    res.status(200).json({ status: "succes", payload: newCarts });
  }
});
router.get("/:cid", async (req, res) => {
  const result = await getProductsFromCart(req, res);
  res.status(result.statusCode).json(result.response);
});

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartToUpdate = await cm.getCartById(cid);
    if (typeof cartToUpdate === "string") {
      return res.status(404).json({ status: "error", error: cartToUpdate });
    }
    const products = req.body.products;
    if (!products) {
      return res
        .status(400)
        .json({ status: "error", error: 'Field "products" is not optional' });
    }
    for (let index = 0; index < products.length; index++) {
      if (
        !products[index].hasOwnProperty("product") ||
        !products[index].hasOwnProperty("quantity")
      ) {
        return res.status(400).json({
          status: "error",
          error: "product must have a valid id and a valid quantity",
        });
      }
      if (typeof products[index].quantity !== "number") {
        return res.status(400).json({
          status: "error",
          error: "product's quantity must be a number",
        });
      }
      if (products[index].quantity === 0) {
        return res
          .status(400)
          .json({ status: "error", error: "product's quantity cannot be 0" });
      }
      const productToAdd = await productModel.findById(products[index].product);
      if (productToAdd === null) {
        return res.status(400).json({
          status: "error",
          error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}`,
        });
      }
    }
    cartToUpdate.products = products;
    const result = await cm.updateCart(cid, cartToUpdate);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cartToUpdate = await cm.getCartById(cid);
    if (typeof cartToUpdate === "string") {
      return res
        .status(404)
        .json({ status: "error", error: `Cart with id=${cid} Not found` });
    }
    const productToUpdate = await pm.getProductById(pid);
    if (typeof productToUpdate === "string") {
      return res
        .status(404)
        .json({ status: "error", error: `Product with id=${pid} Not found` });
    }
    const quantity = req.body.quantity;
    if (!quantity) {
      return res
        .status(400)
        .json({ status: "error", error: 'Field "quantity" is not optional' });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({
        status: "error",
        error: "product's quantity must be a number",
      });
    }
    if (quantity === 0) {
      return res
        .status(400)
        .json({ status: "error", error: "product's quantity cannot be 0" });
    }
    const productIndex = cartToUpdate.products.findIndex(
      (item) => item.product == pid
    );
    if (productIndex === -1) {
      return res.status(400).json({
        status: "error",
        error: `Product with id=${pid} Not found in Cart with id=${cid}`,
      });
    } else {
      cartToUpdate.products[productIndex].quantity = quantity;
    }
    const result = await cm.updateCart(cid, cartToUpdate);
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newcart = await cm.addCart();
    if (typeof newcart === "string") {
      return res
        .status(404)
        .json({ status: "error", error: `${newcart.message}` });
    }
    res.status(201).json({ status: "success", payload: newcart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const newCart = await cm.addProductToCart(cid, pid);
    if (typeof newCart === "string") {
      return res.status(404).json({ status: "error", error: newCart });
    }
    res.status(200).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const find = await cm.getCartById(id);
    if (typeof find === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exist" });
    }
    find.products = [];
    const newCart = await cm.updateCart(id, find);
    res.status(200).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cm.deleteProductFromCart(cid, pid);
    if (typeof result === "string") {
      return res.status(404).json({ status: "error", error: result });
    }
    res.status(200).json({ status: "success", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
});

export default router;
