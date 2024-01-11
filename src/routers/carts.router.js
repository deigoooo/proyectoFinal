import { Router } from "express";
import {
  getCartController,
  getCartsController,
  updateCartController,
  updateProductOnCartController,
  addCartController,
  addProductToCartController,
  deleteCartController,
  deleteProductFromCart,
  purchaseController,
} from "../controller/carts.controller.js";

const router = Router();

router.get("/", getCartsController);
router.post("/", addCartController);
router.get("/:cid", getCartController);
router.put("/:cid", updateCartController);
router.delete("/:cid", deleteCartController);
router.get("/:cid/purchase", purchaseController);
router.put("/:cid/product/:pid", updateProductOnCartController);
router.post("/:cid/product/:pid", addProductToCartController);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
