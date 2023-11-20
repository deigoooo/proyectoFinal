import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class User {
  static get model() {
    //nombre de la collection
    return "Carts";
  }
  static get schema() {
    return {
      products: {
        type: [
          {
            _id: false,
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
            },
            quantity: Number,
          },
        ],
        default: [],
      },
    };
  }
}
