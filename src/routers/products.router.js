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

router.get(
  "/",
  handlePolicies(["USER", "ADMIN", "PREMIUM"]),
  getProductsController
);

router.get(
  "/:id",
  handlePolicies(["USER", "ADMIN", "PREMIUM"]),
  getProductsByIdController
);

router.put(
  "/:id",
  handlePolicies(["PREMIUM", "ADMIN"]),
  updateProductsController
);

router.post("/" , handlePolicies(["PREMIUM", "ADMIN"]) , addProductsController);

router.delete(
  "/:id",
  handlePolicies(["PREMIUM", "ADMIN"]),
  deleteProductsController
);

export default router;
