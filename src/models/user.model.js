import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
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
    enum: ["user", "admin", "premium"], //tipos de roles para usuarios
    default: "user", // Valor por defecto: 'usuario'
  },
  documents: [{
    _id: false,
    name: String,
    reference: String
  }],
  last_connection:{ type: Date, default: Date}
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
