import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import config from "./config.js";

const mailController = async (ticket) => {
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
        data: ticket.products,
        amount: ticket.amount,
      },
      outro: "Looking forward to do more business",
    },
  };
  let mail = Mailgenerator.generate(response);

  let message = {
    from: "Dpto Ventas - Diego Shop <df.ramirezz@gmail.com>",
    to: destinatario,
    subject: `Compra ${numeroPedido} realizada con éxito`,
    html: mail,
  };
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(200).json({ message: "Yo have received an email" });
    })
    .catch((err) => res.status(500).json({ err }));
};
export default mailController;
