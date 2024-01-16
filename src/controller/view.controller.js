import { cartService } from "../services/Factory.js";
import { productService } from "../services/Factory.js";
import config from "../config/config.js";

export const getViewController = async (req, res) => {
  const result = await productService.getAllPaginate(req, config.PORT);
  if (result.statusCode === 200) {
    const totalPages = [];

    let link;
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${config.PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${config.PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    /* console.log(req.session.user); */
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
};

export const realTimeController = async (req, res) => {
  const result = await productService.getAllPaginate(req, config.PORT);
  if (result.statusCode === 200) {
    const totalPages = [];

    let link;
    for (let index = 1; index <= result.response.totalPages; index++) {
      if (!req.query.page) {
        link = `http://${req.hostname}:${config.PORT}${req.originalUrl}?page=${index}`;
      } else {
        const modifiedUrl = req.originalUrl.replace(
          `page=${req.query.page}`,
          `page=${index}`
        );
        link = `http://${req.hostname}:${config.PORT}${modifiedUrl}`;
      }
      totalPages.push({ page: index, link });
    }
    res.render("realTimeProducts", {
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
};

export const getProductViewController = async (req, res) => {
  const result = await cartService.getProductsFromCart(req, res);
  if (result.statusCode === 200) {
    res.render("productsFromCart", { cart: result.response.payload });
  } else {
    res
      .status(result.statusCode)
      .json({ status: "error", error: result.response.error });
  }
};

export const getModifyProductController = async (req, res) => {
  const pid = req.params.pid;
  const user = req.session.user;

  const product = await productService.getById(pid);
  res.render("modifyProduct", { product: product, user: user });
};
