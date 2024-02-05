import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "../config/config.js";
import ticketModel from "../models/ticket.model.js";

let nodemailerConfig = {
  service: "gmail",
  auth: {
    user: config.nodemailer.nodemailer_user,
    pass: config.nodemailer.nodemailer_password,
  },
};
export const mailTicketServices = async (ticket) => {
  const destinatario = ticket.purchaser;
  const numeroPedido = ticket.code;
  let transporter = nodemailer.createTransport(nodemailerConfig);
  let Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Ecommerce de Diego Ramirez",
      link: "http://www.DiegoFernandoRamirez.com",
    },
  });
  let response = {
    body: {
      intro: "Your bill has arrived!",
      table: {
        data: [],
      },
      outro: `The total amount is ${ticket.amount}`,
    },
  };
  const allProducts = await ticketModel
    .findById(ticket._id)
    .populate("products.product")
    .lean();

  for (let index = 0; index < allProducts.products.length; index++) {
    response.body.table.data.push({
      Product: allProducts.products[index].product.title,
      Price: allProducts.products[index].product.price,
      Quantity: ticket.products[index].quantity,
    });
  }
  let mail = Mailgenerator.generate(response);

  let message = {
    from: "Dpto Ventas - Diego Shop <df.ramirezz@gmail.com>",
    to: destinatario,
    subject: `Compra realizada con éxito, tu codigo es: ${numeroPedido} `,
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return `USTED A RECIBIDO UN CORREO`;
    })
    .catch((err) => `[ERROR]: ${err.message}`);
};
//export default mailServices;

export const mailDeleteProduct = async(product)=>{
const destination = product.owner
let transporter = nodemailer.createTransport(nodemailerConfig);
  let Mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Ecommerce de Diego Ramirez",
      link: "http://www.DiegoFernandoRamirez.com",
    },
  });
  let response = {
    body: {
      intro: "Your product has been deleted!",
      table: {
        data: [{
          Title: product.title,
          Description: product.description,
          Price: product.price,
          Stock: product.stock,
          code: product.code,
          Category: product.category
        }],
      },
      outro: `This product [${product.title}] will no longer be shown`,
    },
  };

  let mail = Mailgenerator.generate(response);

  let message = {
    from: "Administracion - Diego Shop <df.ramirezz@gmail.com>",
    to: destination,
    subject: `El producto ${product.title} ah sido eliminado `,
    html: mail,
  };

  transporter.sendMail(message)
};
