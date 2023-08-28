import { Router } from "express";
import ProductManager from "../contenedor/productManager.js";

const router = Router();
const pm = new ProductManager("./src/contenedor/products.txt");

router.get("/home", async (req, res) => {
  const product = await pm.getProduct();
  console.log(product);
  res.render("home", { product });
});
router.get("/", async (req, res) => {
  const product = await pm.getProduct();
  res.render("home", { product });
});

export default router;
