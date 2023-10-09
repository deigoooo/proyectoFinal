import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../util.js";

const router = Router();

router.post("/user", async (req, res) => {
  try {
    const user = req.body;
    if (
      user.email === "adminCoder@coder.com" &&
      user.password === "adminCod3r123"
    ) {
      user.role = "admin";
      req.session.user = user;
      return res.status(200).json({ status: "success", payload: user });
    }

    const isValid = await userModel
      .findOne({ email: user.email })
      .lean()
      .exec();

    if (isValid === null) {
      return res
        .status(401)
        .json({ status: "error", error: "El usuario no existe" });
    }
    if (!isValidPassword(isValid, user.password)) {
      return res
        .status(401)
        .json({ status: "error", error: "Contraseña incorrecta" });
    }

    req.session.user = isValid;
    res.status(200).json({ status: "success", payload: isValid });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    if (Object.keys(req.body).length === 0)
      return res.status(404).json({ status: "error", error: "Body is empty" });
    user.password = createHash(user.password);
    const newUser = await userModel.create(user);
    res.status(201).json({ status: "success", payload: newUser });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Logout error");
    return res.send("Logout ok");
  });
});

export default router;
