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
} from "../controller/carts.controller.js";

const router = Router();

router.get("/", getCartsController);
router.get("/:cid", getCartController);
//router.get('/:cid/purchase', purchaseController)
router.put("/:cid", updateCartController);
router.put("/:cid/product/:pid", updateProductOnCartController);
router.post("/", addCartController);
router.post("/:cid/product/:pid", addProductToCartController);
router.delete("/:cid", deleteCartController);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
