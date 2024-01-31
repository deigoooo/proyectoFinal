import { Router } from "express";
import {
  putUserController,
  postUserController,
  getViewController,
  getUsersController,
  deleteUsersController
} from "../controller/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/premium/:uid", putUserController);
router.get("/view", getViewController);
router.post(
  "/:uid/documents",
  uploader.fields([
    { name: "profile" },
    { name: "products" },
    { name: "documents" },
  ]),
  postUserController
);
router.get("/",getUsersController);
router.delete("/",deleteUsersController);

export default router;
