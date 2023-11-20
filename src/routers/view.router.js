import { Router } from "express";
//import { auth } from "../middlewares/auth.middleware.js";
import {
  getViewController,
  realTimeController,
  getProductViewController,
} from "../controller/view.controller.js";

const router = Router();

router.get("/", getViewController);

router.get("/realTimeProducts", realTimeController);

router.get("/:cid", getProductViewController);

export default router;
