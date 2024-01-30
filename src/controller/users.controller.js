import userModel from "../models/user.model.js";

export const putUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userModel.findById(uid).lean().exec();
    let result;
    if (user === null)
      { return res.status(404).json({ status: "error", error: "User not found" });}
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

    result = await userModel.findByIdAndUpdate(uid, user, {
      returnDocument: "after",
    });
    res.status(200).json({ status: "success", payload: result.role });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const postUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userModel.findById(uid).lean().exec();
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
    await userModel.findByIdAndUpdate(uid, user, { new: true });
    res
      .status(200)
      .json({ status: "succes", payload: "image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

export const getViewController = (req, res) => {
  const uid = req.session.user._id;
  res.render("imgForm", { id: uid });
};
