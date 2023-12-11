import { productService } from "../services/Factory.js";
import config from "../config/config.js";

export const getProductsController = async (req, res) => {
  try {
    const result = await productService.getAllPaginate(req, config.PORT);
    res.status(result.statusCode).json(result.response);
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

export const getProductsByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.getById(id);
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
};

export const updateProductsController = async (req, res) => {
  try {
    const id = req.params.id;
    const productUpdate = req.body;
    const result = await productService.update(id, productUpdate);
    if (typeof result === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exists" });
    }
    const products = await productService.getAll();
    req.io.emit("updateProduct", products);
    res.status(200).json({ status: "succes", payload: result });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
export const addProductsController = async (req, res) => {
  try {
    const product = req.body;
    if (Object.keys(req.body).length === 0)
      return res.status(404).json({ status: "error", error: "Body is empty" });
    const newProduct = await productService.create(product);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
export const deleteProductsController = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await productService.getAll();
    const exist = products.find((product) => product._id == id);
    if (!exist)
      return res
        .status(404)
        .json({ status: "error", error: "ID does not exist" });
    const newProducts = await productService.delete(id);
    req.io.emit("updateProduct", await productService.getAll());
    res.status(200).json({ status: "success", payload: newProducts });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
