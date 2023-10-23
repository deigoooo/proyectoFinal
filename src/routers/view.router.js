import { Router } from "express";
import ProductManager from "../dao/DB/productManager.js";
import { getProductsFromCart } from "./carts.router.js";
import { getProducts } from "./products.router.js";
import { PORT } from "../app.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();
const pm = new ProductManager(/* "./src/dao/fileSystem/products.txt" */);

router.get("/home", async (req, res) => {
  const product = await pm.getProduct();
  res.render("home", { product });
});

router.get("/", auth, async (req, res) => {
  const result = await getProducts(req, res);
  if (result.statusCode === 200) {
    const totalPages = [];

    let link;
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    res.render("home", {
      user: req.session.user,
      products: result.response.payload,
      paginateInfo: {
        hasPrevPage: result.response.hasPrevPage,
        hasNextPage: result.response.hasNextPage,
        prevLink: result.response.prevLink,
        nextLink: result.response.nextLink,
        totalPages,
      },
    });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  const result = await getProducts(req, res);
  if (result.statusCode === 200) {
    //console.log(result.response);
    res.render("realTimeProducts", { products: result.response.payload });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

router.get("/:cid", async (req, res) => {
  const result = await getProductsFromCart(req, res);
  if (result.statusCode === 200) {
    res.render("productsFromCart", { cart: result.response.payload });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
});

export default router;
