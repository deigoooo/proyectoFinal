import { Router } from "express";
import { getMessageController } from "../controller/messages.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", handlePolicies(["USER", "ADMIN", "PREMIUM"]), getMessageController);

export default router;
