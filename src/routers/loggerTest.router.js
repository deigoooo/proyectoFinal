import { Router } from "express";
import { loggerTestController } from "../controller/loggerTest.controller.js";
// import { getMessageController } from "../controller/messages.controller.js";
// import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", loggerTestController);

export default router;
