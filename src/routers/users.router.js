import { Router } from "express";
import { putUserController } from "../controller/users.controller.js";

const router = Router();

router.get("/premium/:uid", putUserController);

export default router;
