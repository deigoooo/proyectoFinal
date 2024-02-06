import { Router } from "express";
import {
  getViewController,
  realTimeController,
  getProductViewController,
  getModifyProductController,
  successViewController,
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

router.get("/modify/:pid", handlePolicies(["ADMIN", "PREMIUM"]),getModifyProductController);

router.get('/success/:cid',successViewController);
router.get('/cancel', (req, res) => res.send('cancel'));

export default router;
