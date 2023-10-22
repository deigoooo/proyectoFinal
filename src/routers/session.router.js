import { Router } from "express";
import passport from "passport";

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
    req.session.user = {
      firstname: req.user.first_name,
      lastname: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
    };
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
    console.log(req.user);
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
