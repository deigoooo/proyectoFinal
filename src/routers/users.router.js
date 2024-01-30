import { Router } from "express";
import {
  putUserController,
  postUserController,
  getViewController,
} from "../controller/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/premium/:uid", putUserController);
router.get("/view", getViewController);
router.post("/:uid/documents" , uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'products', maxCount: 1 },
    { name: 'documents', maxCount: 1 }
  ]) , postUserController);

export default router;
