import { Router } from "express";
import { getMessageController } from "../controller/messages.controller.js";

const router = Router();

router.get("/", getMessageController);

export default router;
