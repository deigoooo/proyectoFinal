import messageModel from "../models/message.model.js";

class MessageManager {
  constructor() {}
  async getMessage() {
    try {
      const response = await messageModel.find();
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async getMessageById(id) {
    try {
      const response = await messageModel.findOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async addMessage() {
    try {
      const response = await messageModel.create();
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
  async deleteMessage(id) {
    try {
      const response = await messageModel.deleteOne({ _id: id });
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  }
}

export default MessageManager;
