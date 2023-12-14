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
  //console.log(`aca en el session controller${req.flash("error")}`);
  const newError = req.flash("error");
  res.send({ error: `${newError}` });
};

export const sessionCallbackController = async (req, res) => {
  req.session.user = new UserDTO(req.user);
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
