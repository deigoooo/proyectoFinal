import UserDTO from "../dto/user.dto.js";

export const getRegisterController = async (req, res) => {
  res.render("register");
};
export const getLoginController = async (req, res) => {
  res.render("login");
};
export const postRegisterController = async (req, res) => {
  res.redirect("/session/login");
};
export const sessionFailController = async (req, res) => {
  res.send({ error: `${req.flash("error")}` });
};

export const sessionCallbackController = async (req, res) => {
  req.session.user = new UserDTO(req.user);
  /* req.session.user = {
    _id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    password: req.user.password,
    carts: req.user.carts.cart._id,
    role: req.user.role,
    __v: req.user.__v,
  }; */
  res.redirect("/products");
};
export const logoutSessionController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/session/login");
  });
};
export const sessionController = async (req, res) => {};
