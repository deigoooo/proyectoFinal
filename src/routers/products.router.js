import { Router } from "express";
import {
  getProductsController,
  getProductsByIdController,
  updateProductsController,
  addProductsController,
  deleteProductsController,
} from "../controller/products.controller.js";

const router = Router();

router.get("/", getProductsController);

router.get("/:id", getProductsByIdController);

router.put("/:id", updateProductsController);

router.post("/", addProductsController);

router.delete("/:id", deleteProductsController);

export default router;
