import { Router } from "express";
import passport from "passport";
import Swal from "sweetalert2";
import { JWT_COOKIE_NAME } from "../util.js";

const router = Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
  }),
  async (req, res) => {
    res.redirect("/session/login");
  }
);

router.get("/failRegister", (req, res) => {
  res.send({ error: `El usuario ya existe` });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({ status: "error", error: req.user });
    }
    let id;
    for (let cart of req.user.carts) {
      id = cart.cart._id;
    }
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      password: req.user.password,
      carts: id,
      role: req.user.role,
      __v: req.user.__v,
    };
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products");
  }
);

router.get("/failLogin", (req, res) =>
  res.send({ error: "Passport login failed" })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/failLogin" }),
  async (req, res) => {
    let id;
    for (let cart of req.user.carts) {
      id = cart.cart._id;
    }

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      password: req.user.password,
      carts: id,
      role: req.user.role,
      __v: req.user.__v,
    };
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products");
  }
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {}
);

router.get(
  "/googlecallback",
  passport.authenticate("google", {
    failureRedirect: "/session/failLogin",
    /* successRedirect: "/products", */
  }),
  async (req, res) => {
    let id;
    for (let cart of req.user.carts) {
      id = cart.cart._id;
    }

    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      password: req.user.password,
      carts: id,
      role: req.user.role,
      __v: req.user.__v,
    };
    res.cookie(JWT_COOKIE_NAME, req.user.token).redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  try {
    req.session.destroy;
    res.clearCookie(JWT_COOKIE_NAME);
    res.redirect("/");
  } catch (error) {
    res.status(500).render("errors/base", { error: error });
  }
});
export default router;
