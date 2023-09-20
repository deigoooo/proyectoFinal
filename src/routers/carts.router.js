import { Router } from "express";
//import CartManager from "../dao/fileSystem/cartManager.js";
import CartManager from "../dao/DB/cartManager.js";

const router = Router();
const cm = new CartManager("./src/dao/fileSystem/carts.txt");
//"./src/contenedor/carts.txt"

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const carts = await cm.getCart();
  const newCarts = [];
  if (!limit) {
    res.status(200).json({ status: "succes", payload: await carts });
  } else {
    for (let i = 0; i < limit && i < carts.length; i++) {
      newCarts.push(carts[i]);
    }
    res.status(200).json({ status: "succes", payload: newCarts });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await cm.getCartById(id);
  if (typeof result === "string") {
    return res
      .status(404)
      .json({ status: "error", error: "ID does not exists" });
  } else {
    res.status(200).json({ status: "succes", payload: result.products });
  }
});

router.post("/", async (req, res) => {
  const newcart = await cm.addCart();
  console.log(newcart);
  res.status(201).json({ status: "success", payload: newcart });
});
router.post("/:cid/product/:pid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const newCart = await cm.addProductToCart(cid, pid);
  if (typeof newCart === "string") {
    res.status(404).json({ status: "error", payload: newCart });
  }
  res.status(200).json({ status: "success", payload: newCart.products });
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const allCarts = await cm.getCart();
  const exist = allCarts.find((cart) => cart.id === id);
  if (!exist)
    return res
      .status(404)
      .json({ status: "error", error: "ID does not exist" });
  await cm.deleteCart(id);
  res
    .status(200)
    .json({ status: "success", payload: `Cart ID: ${id} was deleted` });
});

export default router;
