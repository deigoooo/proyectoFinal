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
      const response = await userModel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      });
      if (response === null) {
        return `[ERROR]: ${id} does not exist`;
      }
      return response;
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
  deletePerDate = async () => {
    try {
      const users = await userModel.find().lean().exec();
      const limiteDeTiempo = new Date(Date.now() - 48 * 60 * 60 * 1000);
      for (let index = 0; index < users.length; index++) {
        const lastConnectionDate = new Date(users[index].last_connection);
        if (lastConnectionDate < limiteDeTiempo) {
          if (users[index].role != "admin") {
            await userModel.deleteOne({ _id: users[index]._id });
          }
        }
      }
      return await userModel.find().lean().exec();
    } catch (error) {
      return `[ERROR]: ${error.message}`;
    }
  };
}
