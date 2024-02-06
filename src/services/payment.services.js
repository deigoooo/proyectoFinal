//import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import Stripe from "stripe";
import config from "../config/config.js";

const stripe = new Stripe(config.stripe.stripe_access_token);

export const payment = async (ticket,cid) => {
  try {
    let items=[];
    for (let i = 0; i < ticket.length; i++) {
      items.push({
        price_data: {
          product_data:{
            name: ticket[i].title,
            description: ticket[i].description,
          },
          currency: "usd",
          unit_amount: ticket[i].price * 100,
        },
        quantity: ticket[i].quantity,
      });
    }
    const response = await stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url:`http://localhost:8080/products/success/${cid}`,
      cancel_url: `http://localhost:8080/cancel`
    }); 
    return response;
  } catch (error) {

    console.error(`error: ${error}`);
    return error.message;
  }
};
