import { Router } from "express";
import ProductManager from "../contenedor/productManager.js";

const router = Router();
const pm = new ProductManager("./src/contenedor/products.txt");

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await pm.getProduct();
  const newProducts = [];
  if (!limit) {
    res.status(200).json({ status: "succes", payload: await products });
  } else {
    for (let i = 0; i < limit && i < products.length; i++) {
      newProducts.push(products[i]);
    }
    res.status(200).json({ status: "succes", payload: newProducts });
  }
});
router.get("/:id", async (req, res) => {
  const products = await pm.getProduct();
  const id = parseInt(req.params.id);
  const result = products.find((product) => product.id === id);
  if (!result) {
    return res
      .status(404)
      .json({ status: "error", error: "ID does not exists" });
  } else {
    res.status(200).json({ status: "succes", payload: result });
  }
});
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const productUpdate = req.body;
  const products = await pm.getProduct();
  const idProduct = products.find((product) => product.id === id);
  if (!idProduct)
    return res
      .status(404)
      .json({ status: "error", error: "ID does not exists" });
  const newProduct = await pm.updateProduct(id, productUpdate);
  res.status(200).json({ status: "succes", payload: newProduct });
});
router.post("/", async (req, res) => {
  const product = req.body;
  if (Object.keys(req.body).length === 0)
    return res.status(404).json({ status: "error", error: "Body is empty" });

  const newProduct = await pm.addProduct(product);
  res.status(201).json({ status: "success", payload: newProduct });
});
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const products = await pm.getProduct();
  const exist = products.find((product) => product.id === id);
  if (!exist)
    return res
      .status(404)
      .json({ status: "error", error: "ID does not exist" });
  await pm.deleteProduct(id);
  res
    .status(200)
    .json({ status: "success", payload: `Product ID: ${id} was deleted` });
});

export default router;
