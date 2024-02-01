import { Router } from "express";
import {
  putUserController,
  postUserController,
  getViewController,
  getUsersController,
  deleteUserPerDateController,
  getAdminUserController
} from "../controller/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/premium/:uid", putUserController);
router.get("/view", getViewController);
router.get("/admin", getAdminUserController);
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
router.delete("/",deleteUserPerDateController);

export default router;
