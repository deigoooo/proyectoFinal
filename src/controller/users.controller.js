import userModel from "../models/user.model.js";

export const putUserController = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await userModel.findById(uid).lean().exec();
    /* if (user === null) {
      return res.status(400).json({ status: "error", error: "User not found" });
    } */
    let result;

    if (user.role === "user") {
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
