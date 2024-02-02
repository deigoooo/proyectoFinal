import { Router } from "express";
import {
  putUserController,
  postUserController,
  getViewController,
  getUsersController,
  deleteUserPerDateController,
  getAdminViewUserController,
  deleteUserByIdController,
  putRoleUserController,
} from "../controller/users.controller.js";
import { uploader } from "../middlewares/multer.middleware.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/premium/:uid", putUserController);
router.get("/view", getViewController);
router.get("/admin", handlePolicies(["ADMIN"]), getAdminViewUserController);
router.post(
  "/:uid/documents",
  uploader.fields([
    { name: "profile" },
    { name: "products" },
    { name: "documents" },
  ]),
  postUserController
);
router.put("/:uid", putRoleUserController);
router.get("/", getUsersController);
router.delete("/", handlePolicies(["ADMIN"]), deleteUserPerDateController);
router.delete("/:uid", handlePolicies(["ADMIN"]), deleteUserByIdController);

export default router;
