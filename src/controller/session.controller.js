import passport from "passport";

export const getRenderRegisterController = async (res, req) => {
  res.render("register");
};
export const getRenderLoginController = async (res, req) => {
  res.render("login");
};
export const postRegisterController = async (res, req) => {
  res.redirect("/session/login");
};
export const sessionFailController = async (res, req) => {
  console.log(`entro aca`);
  res.send({ error: `El usuario ya existe ${req.user}` });
};

export const sessionCallbackController = async (res, req) => {
  console.log(`El usuario ya existe ${req.user}`);
  let id;
  for (let cart of req.user.carts) {
    id = cart.cart._id;
  }

  req.session.user = {
    _id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    password: req.user.password,
    carts: id,
    role: req.user.role,
    __v: req.user.__v,
  };
  res.redirect("/products");
};
export const logoutSessionController = async (res, req) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).render("errors/base", { error: err });
    } else res.redirect("/session/login");
  });
};
//export const getRenderController = async (res, req) => {};
//export const getRenderController = async (res, req) => {};
//export const getRenderController = async (res, req) => {};
