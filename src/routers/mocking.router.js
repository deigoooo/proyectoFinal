import { Router } from "express";
import { getMockingController } from "../controller/mocking.controller.js";

const router = Router();

router.get("/", getMockingController);

export default router;
