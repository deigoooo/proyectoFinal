export const auth = (req, res, next) => {
  if (req.session.user?.role === "admin" || req.session.user?.role === "user") {
    next();
  } else {
    res.send("Not allowed!");
  }
};
