import { Router } from "express";
import passport from "passport";
import userModel from "../dao/models/user.model.js";

const router = Router();

/* 
pequeña prueba para ver el populate en user
router.get("/cartfromuser/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const result = await userModel.findById(id).populate("cart.cart").lean();
    if (result === null) {
      return res.status(404).json({ status: "error", error: "Not found" });
    }
    return res.status(200).json({ status: "succes", payload: result });
  } catch (error) {
    res.send(500).json({ status: "error", error: error.message });
  }
}); */

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
  }),
  async (req, res) => {
    //console.log(req.flash("error")[0]);
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
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = req.user;
    res.redirect("/products");
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
  passport.authenticate("github", { failureRedirect: "/session/login" }),
  async (req, res) => {
    //console.log("Callback: ", req.user);
    req.session.user = req.user;
    res.redirect("/products");
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
    failureRedirect: "/failure",
    /* successRedirect: "/products", */
  }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/session/login");
  });
});
export default router;
