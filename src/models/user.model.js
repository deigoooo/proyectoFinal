import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class User {
  static get model() {
    //nombre de la collection
    return "Users";
  }
  static get schema() {
    return {
      first_name: String,
      last_name: String,
      age: Number,
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: String,
      carts: {
        type: {
          _id: false,
          cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "carts",
          },
        },

        default: {},
      },
      role: {
        type: String,
        enum: ["user", "admin"], //tipos de roles para usuarios
        default: "user", // Valor por defecto: 'usuario'
      },
    };
  }
}
