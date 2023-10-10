import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: String,
  age: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  cart: {
    type: [
      {
        _id: false,
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"], //tipos de roles para usuarios
    default: "user", // Valor por defecto: 'usuario'
  },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
