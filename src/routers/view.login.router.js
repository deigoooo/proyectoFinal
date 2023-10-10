import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const router = new Router();

router.get("/", async (req, res) => {
  //const users = await userModel.find().lean().exec();
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/failRegister", (req, res) => {
  res.send({ erro: "Passport Register Fail" });
});

router.get("/failLogin", (req, res) => {
  res.send({ erro: "Passport Login Fail" });
});

router.get("/logout", (req, res) => {});

export default router;
