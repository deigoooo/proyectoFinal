import { UserGetDTO } from "../dto/user.dto.js";
import { userService } from "../services/Factory.js";

export const putUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userService.getById(uid);
    let result;
    if (user === null) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }
    if (user.role === "user") {
      if (user.documents.length < 3) {
        return res
          .status(404)
          .json({ status: "error", error: "Must upload documentation" });
      }
      user.role = "premium";
    } else if (user.role === "premium") {
      user.role = "user";
    }

    result = await userService.update(uid, user);
    if (typeof result === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "Something goes wrong" });
    }

    res.status(200).json({ status: "success", payload: result.role });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const postUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userService.getById(uid);
    if (user === null) {
      res.status(404).json({ status: "error", error: "Id does not exist" });
    }
    const file = req.files;
    if (file.documents !== undefined) {
      for (let index = 0; index < file.documents.length; index++) {
        user.documents.push({
          name: file.documents[index].originalname,
          reference: file.documents[index].path,
        });
      }
    }
    if (file.profile !== undefined) {
      for (let index = 0; index < file.profile.length; index++) {
        user.documents.push({
          name: file.profile[index].originalname,
          reference: file.profile[index].path,
        });
      }
    }
    if (file.products !== undefined) {
      for (let index = 0; index < file.products.length; index++) {
        user.documents.push({
          name: file.products[index].originalname,
          reference: file.products[index].path,
        });
      }
    }
    /*     for (let index = 0; index < file.profile.length; index++) {
      user.documents.push({
        name: file.profile[index].originalname,
        reference: file.profile[index].path,
      });
    }
    for (let index = 0; index < file.products.length; index++) {
      user.documents.push({
        name: file.products[index].originalname,
        reference: file.products[index].path,
      });
    } */
    const result = await userService.update(uid, user);

    if (typeof result === "string") {
      return res
        .status(404)
        .json({ status: "error", error: "Something goes wrong" });
    }
    res
      .status(200)
      .json({ status: "succes", payload: "image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const getViewController = async (req, res) => {
  const uid = req.session.user._id;
  res.render("imgForm", { id: uid });
};

export const getUsersController = async (req, res) => {
  try {
    const users = await userService.getAll();
    const dtoUsers = users.map((user) => {
      return new UserGetDTO(user);
    });
    res.status(200).json({ status: "success", payload: dtoUsers });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const deleteUserPerDateController = async (req, res) => {
  try {
    const response = await userService.deletePerDate();
    res.status(200).json({ status: "success", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const getAdminViewUserController = async (req, res) => {
  const users = await userService.getAll();
  const dtoUsers = users.map((user) => {
    return new UserGetDTO(user);
  });
  res.render("users", { dtoUsers });
};

export const deleteUserByIdController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const isAdmin = await userService.getById(uid);
    if (req.session.user._id == uid) {
      return res.status(400).json({
        status: "error",
        error: `No puede borrarse a si mismo`,
      });
    }
    if (isAdmin.role === "admin") {
      return res.status(400).json({
        status: "error",
        error: "No tiene privilegios para borrar a un Admin",
      });
    }
    const user = await userService.delete(uid);
    if (typeof user === "string") {
      return res.status(400).json({ status: "error", error: `${user.error}` });
    }
    const response = await userService.getAll();
    res.status(200).json({ status: "success", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const putRoleUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userService.getById(uid);
    if (typeof user === "string") {
      return res.status(400).json({ status: "error", error: `${user.error}` });
    }
    switch (user.role) {
      case "admin":
        user.role = "user";
        break;
      case "user":
        user.role = "premium";
        break;
      case "premium":
        user.role = "admin";
        break;
      default:
        return res
          .status(400)
          .json({ status: "error", error: `Rol no especificado` });
    }
    const response = await userService.update(user._id, user);
    res.status(200).json({ status: "success", payload: response });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};
