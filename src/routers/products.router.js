import { Router } from "express";
import ProductManager from "../dao/DB/productManager.js";
import { PORT } from "../app.js";

const router = Router();

//lo comentado es del FileSystem
const pm = new ProductManager(/* "./src/dao/fileSystem/products.txt" */);

export const getProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;

    const filterOption = {};
    if (req.query.stock) filterOption.stock = req.query.stock;
    if (req.query.category) filterOption.category = req.query.category;

    const paginateOptions = { lean: true, limit, page };
    if (req.query.sort === "asc") paginateOptions.sort = { price: 1 };
    if (req.query.sort === "desc") paginateOptions.sort = { price: -1 };

    const result = await pm.paginate(filterOption, paginateOptions);
    console.log(result);
    let prevlink;
    if (!req.query.page) {
      prevlink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.prevPage}`;
    } else {
      const modifiedUrl = req.originalUrl.replace(
        `page=${req.query.page}`,
        `page="${result.prevpage}`
      );
      prevlink = `http://${req.hostname}:${PORT}${req.modifiedUrl}`;
    }

    let nextlink;
    if (!req.query.page) {
      nextlink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${result.nextPage}`;
    } else {
      const modifiedUrl = req.originalUrl.replace(
        `page=${req.query.page}`,
        `page="${result.nextPage}`
      );
      nextlink = `http://${req.hostname}:${PORT}${req.modifiedUrl}`;
    }

    return {
      statusCode: 200,
      response: {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevpage,
        nextPage: result.nextpage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevlink: result.hasPrevPage ? prevlink : null,
        nextLink: result.hasNextPage ? nextlink : null,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      response: { status: "error", error: err.message },
    };
  }
};

router.get("/", async (req, res) => {
  const result = await getProducts(req, res);
  res.status(result.statusCode).json(result.response);
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pm.getProductById(id);
    if (typeof result === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exists" });
    } else {
      res.status(200).json({ status: "succes", payload: result });
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const productUpdate = req.body;
    const result = await pm.updateProduct(id, productUpdate);
    const products = await pm.getProduct();
    if (typeof result === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exists" });
    }
    req.io.emit("updateProduct", products);
    res.status(200).json({ status: "succes", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    if (Object.keys(req.body).length === 0)
      return res.status(404).json({ status: "error", error: "Body is empty" });
    const newProduct = await pm.addProduct(product);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const products = await pm.getProduct();
    const exist = products.find((product) => product.id === id);
    if (!exist)
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exist" });
    const newProducts = await pm.deleteProduct(id);
    req.io.emit("updateProduct", await pm.getProduct());
    res.status(200).json({ status: "success", payload: newProducts });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
