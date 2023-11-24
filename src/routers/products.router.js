import { Router } from "express";
import {
  getProductsController,
  getProductsByIdController,
  updateProductsController,
  addProductsController,
  deleteProductsController,
} from "../controller/products.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", handlePolicies(["USER,ADMIN"]), getProductsController);

router.get("/:id", handlePolicies(["USER,ADMIN"]), getProductsByIdController);

router.put("/:id", handlePolicies(["ADMIN"]), updateProductsController);

router.post("/", handlePolicies(["ADMIN"]), addProductsController);

router.delete("/:id", handlePolicies(["ADMIN"]), deleteProductsController);

export default router;
