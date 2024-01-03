import ticketModel from "../models/ticket.model.js";

export default class TicketMongoDao {
  constructor() {}
  getAll = async () => await ticketModel.find().lean().exec();
  getById = async (id) => await ticketModel.findById(id).lean().exec();
  create = async (data) => {
    try {
      const response = await ticketModel.create(data);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  delete = async (id) => {
    try {
      const response = await ticketModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  update = async (id, data) => {
    try {
      const result = await ticketModel.findByIdAndUpdate(id, data, {
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
  getProductsFromTicket = async (id) => {
    try {
      const result = await ticketModel
        .findById(id)
        .populate("products.product")
        .lean();
      if (result === null) {
        return `[ERROR]: ticket does not have products`;
      }
      return result;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
}
