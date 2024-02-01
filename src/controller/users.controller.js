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
    for (let index = 0; index < file.documents.length; index++) {
      user.documents.push({
        name: file.documents[index].filename,
        reference: file.documents[index].path,
      });
    }
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

export const getAdminUserController = async (req, res) => {
  const users = await userService.getAll();
  const dtoUsers = users.map((user) => {
    return new UserGetDTO(user);
  });
  res.render("users", { dtoUsers });
};
