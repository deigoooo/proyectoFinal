//import messageModel from "./models/message.model.js";
import messageModel from "../models/message.model.js";

class MessageMongoDao {
  constructor() {}
  getAll = async () => await messageModel.find().lean().exec();
  getById = async (id) => await messageModel.findById(id).lean().exec();
  create = async (data) => {
    try {
      const response = await messageModel.create(data);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  delete = async (id) => {
    try {
      const response = await messageModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  update = async (id, data) => {
    try {
      const result = await messageModel.findByIdAndUpdate(id, data, {
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
}

export default MessageMongoDao;
