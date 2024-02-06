import {
  productService,
  cartService,
  ticketService,
} from "../services/Factory.js";
import { mailTicketServices } from "../services/nodemailer.services.js";
import config from "../config/config.js";
import shortid from "shortid";

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

  if (product.owner == user.email) {
    res.render("modifyProduct", { product: product, user: user });
  } else {
    res.status(404).json({
      status: "error",
      error: "You do not have permission to modify this product",
    });
  }
};

export const successViewController = async (req, res) => {
  const cid = req.params.cid;
  const cartToPurchase = await cartService.getById(cid);
  let productsToTicket = [];
  let productsAfterPurchase = cartToPurchase.products;
  let amount = 0;
  for (let index = 0; index < cartToPurchase.products.length; index++) {
    const productToPurchase = await productService.getById(
      cartToPurchase.products[index].product
    );
    //actualizamos el stock del producto que se está comprando
    productToPurchase.stock -= cartToPurchase.products[index].quantity;
    await productService.update(productToPurchase._id, {
      stock: productToPurchase.stock,
    });
    //eliminamos (del carrito) los productos que se han comparado (en memoria)
    productsAfterPurchase = productsAfterPurchase.filter(
      (item) =>
        item.product.toString() !==
        cartToPurchase.products[index].product.toString()
    );
    //calculamos el amount (total del ticket)
    amount += productToPurchase.price * cartToPurchase.products[index].quantity;
    //colocamos el producto en el Ticket (en memoria)
    productsToTicket.push({
      product: productToPurchase._id,
      description: productToPurchase.description,
      title: productToPurchase.title,
      price: productToPurchase.price,
      quantity: cartToPurchase.products[index].quantity,
    });
  }
  //eliminamos (del carrito) los productos que se han comparado
  await cartService.update(cid, { products: productsAfterPurchase });
  //creamos el Ticket
  const newTicket = {
    code: shortid.generate(),
    products: productsToTicket,
    amount,
    purchaser: req.session.user.email,
  };
  const result = await ticketService.create(newTicket);

  //mandamos el mail
  mailTicketServices(result);

  return res.render("success", { ticket: result.code });
};

export const cancel = async (req, res) => {
  res.send("cancel");
};
