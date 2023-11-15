import { Router } from "express";
import passport from "passport";
import {
  sessionCallbackController,
  sessionFailController,
  postRegisterController,
  getRegisterController,
  getLoginController,
  logoutSessionController,
  sessionController,
} from "../controller/session.controller.js";

const router = Router();

router.get("/register", getRegisterController);

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/failRegister",
  }),
  postRegisterController
);

router.get("/failRegister", sessionFailController);
router.get("/failLogin", sessionFailController);

router.get("/login", getLoginController);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/failLogin" }),
  sessionCallbackController
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  sessionController
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  sessionController
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/session/failLogin" }),
  sessionCallbackController
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/session/failLogin" }),
  sessionCallbackController
);

router.get("/logout", logoutSessionController);
export default router;
