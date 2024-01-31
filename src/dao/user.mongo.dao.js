import userModel from "../models/user.model.js";

export default class UserMongoDao {
  constructor() {}
  getAll = async () => await userModel.find().lean().exec();
  getById = async (id) => await userModel.findById(id).lean().exec();
  create = async (data) => {
    try {
      const response = await userModel.create(data);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  delete = async (id) => {
    try {
      const response = await userModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  update = async (id, data) => {
    try {
      const result = await userModel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
      if (result === null) {
        return `[ERROR]: ${id} does not exist`;
      }
      return result;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
};