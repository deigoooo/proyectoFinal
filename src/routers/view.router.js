import { Router } from "express";
import {
  getViewController,
  realTimeController,
  getProductViewController,
} from "../controller/view.controller.js";
import {
  handlePolicies,
  publicRoutes,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  publicRoutes,
  handlePolicies(["USER", "ADMIN", "PREMIUM"]),
  getViewController
);

router.get(
  "/realTimeProducts",
  handlePolicies(["USER", "ADMIN", "PREMIUM"]),
  realTimeController
);

router.get(
  "/:cid",
  handlePolicies(["USER", "ADMIN", "PREMIUM"]),
  getProductViewController
);

export default router;
