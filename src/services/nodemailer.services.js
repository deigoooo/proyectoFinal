import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "../config/config.js";
import ticketModel from "../models/ticket.model.js";

const mailServices = async (ticket) => {
  const destinatario = ticket.purchaser;
  const numeroPedido = ticket.code;
  let nodemailerConfig = {
    service: "gmail",
    auth: {
      user: config.nodemailer.nodemailer_user,
      pass: config.nodemailer.nodemailer_password,
    },
  };
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
export default mailServices;
