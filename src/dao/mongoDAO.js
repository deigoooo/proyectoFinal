import mongoose from "mongoose";
import User from "../models/user.model.js";

export default class MongoDAO {
  constructor(config) {
    this.mongoose = mongoose.connect(config.url).catch((error) => {
      console.log(error);
      process.exit(1);
    });
    const timestamp = {
      timestamp: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    };
    const userSchema = mongoose.Schema(User.schema, timestamp);
    this.model = {
      [User.model]: mongoose.model(User.model, userSchema),
    };
  }
  get = async (options, entity) => {
    if (!this.model[entity]) throw new Error("Entity not found in models");
    try {
    } catch (error) {}
  };
}
