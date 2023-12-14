import { productService } from "../services/Factory.js";
import config from "../config/config.js";
import CustomError from "../services/errors/custom_error.js";
import EError from "../services/errors/enums.js";
import { generateErrorInfo } from "../services/errors/info.js";

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
      const error = CustomError.createError({
        name: "Products update error",
        cause: generateErrorInfo(result),
        message: "ID does not exist",
        code: EError.DATABASES_ERROR,
      });
      return res.status(404).json({ status: "error", error: error.code });
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
    const { title, description, price, thumbnail, stock, code, category } =
      req.body;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !stock ||
      !code ||
      !category
    ) {
      /*       console.log(`entro al error`); */
      CustomError.createError({
        name: "Add product error",
        cause: generateErrorInfo({
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
          category,
        }),
        message: "Body is empty",
        code: EError.INVALID_TYPES_ERROR,
      });
      /* return res.status(404).json({ status: "error", error: error.code }); */
    }
    const newProduct = await productService.create({
      title,
      description,
      price,
      thumbnail,
      stock,
      code,
      category,
    });
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
