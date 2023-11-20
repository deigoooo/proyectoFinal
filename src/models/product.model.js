import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class User {
  static get model() {
    //nombre de la collection
    return "Product";
  }
  static get schema() {
    return {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      thumbnail: [String],
      stock: { type: Number, required: true },
      code: { type: String, required: true, unique: true },
      status: { type: Boolean, required: true, default: true },
      category: { type: String, required: true },
    };
  }
}
