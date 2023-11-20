import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class User {
  static get model() {
    //nombre de la collection
    return "Messages";
  }
  static get schema() {
    return {
      user: { type: String, required: true },
      message: String,
    };
  }
}
