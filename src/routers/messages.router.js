import { Router } from "express";
import MessageManager from "../dao/DB/messageManager.js";

const router = Router();
const mm = new MessageManager();

router.get("/", (req, res) => {
  res.render("chat", {});
});

export default router;
