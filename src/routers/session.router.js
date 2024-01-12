import { Router } from "express";
import passport from "passport";
import nodemailer from "nodemailer";
import UserDTO from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";
import UserPasswordModel from "../models/user-password.model.js";
import { generateRandomString, createHash } from "../utils/util.js";
import config from "../config/config.js";

const router = Router();

router.get("/register", async (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
    failureFlash: true,
  }),
  async (req, res) => {
    res.redirect("/session/login");
  }
);

router.get("/failRegister", async (req, res) => {
  const newError = req.flash("error");
  res.send({ error: `${newError}` });
});
router.get("/failLogin", async (req, res) => {
  const newError = req.flash("error");
  res.send({ error: `${newError}` });
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/session/failLogin",
    failureFlash: true,
  }),
  async (req, res) => {
    req.session.user = new UserDTO(req.user);
    res.redirect("/products");
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    req.session.user = new UserDTO(req.user);
    res.redirect("/products");
  }
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    req.session.user = new UserDTO(req.user);
    res.redirect("/products");
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/session/login");
  });
});

router.get("/forget-password", (req, res) => {
  res.render("forget-password");
});

router.post("/forget-password", async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "error", error: "User not found" });
  }
  const token = generateRandomString(16);
  await UserPasswordModel.create({ email, token });
  const mailerConfig = {
    service: "gmail",
    auth: {
      user: config.nodemailer.nodemailer_user,
      pass: config.nodemailer.nodemailer_password,
    },
  };
  let transporter = nodemailer.createTransport(mailerConfig);
  let message = {
    from: config.nodemailer.user,
    to: email,
    subject: "[Coder e-comm API] Reset your password",
    html: `<h1>[Coder e-comm API] Reset your password</h1><hr />You have asked to reset your password. You can do it here: <a href="http://${req.hostname}:${config.PORT}/session/reset-password/${token}">http://${req.hostname}:${config.PORT}/session/reset-password/${token}</a><hr />Best regards,<br><strong>The Coder e-comm API team</strong>`,
  };
  try {
    await transporter.sendMail(message);
    res.json({
      status: "success",
      message: `Email successfully sent to ${email} in order to reset password`,
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.get("/reset-password/:token", (req, res) => {
  res.redirect(`/session/verify-token/${req.params.token}`);
});

router.get("/verify-token/:token", async (req, res) => {
  const userPassword = await UserPasswordModel.findOne({
    token: req.params.token,
  });
  if (!userPassword) {
    return res.status(404).json({
      status: "error",
      error: "Token no válido / El token ha expirado",
    });
  }
  const user = userPassword.email;
  res.render("reset-password", { user });
});
router.post("/reset-password/:user", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.user });
    await UserModel.findByIdAndUpdate(user._id, {
      password: createHash(req.body.newPassword),
    });
    res.json({
      status: "success",
      message: "Se ha creado una nueva contraseña",
    });
    await UserPasswordModel.deleteOne({ email: req.params.user });
  } catch (err) {
    res.json({ status: "error", error: err.message });
  }
});
export default router;
