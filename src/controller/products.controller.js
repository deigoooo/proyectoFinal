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

export const getProductsByIdController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await productService.getById(id);
    if (typeof result === "string") {
      throw CustomError.createError({
        name: "Delete product error",
        cause: generateErrorInfo(id),
        message: `ID: ${id} does not exist`,
        code: EError.DATABASES_ERROR,
      });
    } else {
      res.status(200).json({ status: "succes", payload: result });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProductsController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const productUpdate = req.body;
    const result = await productService.update(id, productUpdate);
    if (typeof result === "string") {
      throw CustomError.createError({
        name: "Update products error",
        cause: generateErrorInfo(id),
        message: `ID: ${id} does not exist`,
        code: EError.DATABASES_ERROR,
      });
    }
    const products = await productService.getAll();
    req.io.emit("updateProduct", products);
    res.status(200).json({ status: "succes", payload: result });
  } catch (error) {
    next(error);
  }
};
export const addProductsController = async (req, res, next) => {
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
      throw CustomError.createError({
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
        code: EError.BODY_EMPTY,
      });
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
    next(error);
  }
};
export const deleteProductsController = async (req, res, next) => {
  try {
    const id = req.params.id;
    const products = await productService.getAll();
    const exist = products.find((product) => product._id == id);
    if (!exist) {
      throw CustomError.createError({
        name: "Delete product error",
        cause: generateErrorInfo(id),
        message: `ID: ${id} does not exist`,
        code: EError.DATABASES_ERROR,
      });
    }
    const newProducts = await productService.delete(id);
    req.io.emit("updateProduct", await productService.getAll());
    res.status(200).json({ status: "success", payload: newProducts });
  } catch (error) {
    next(error);
  }
};
