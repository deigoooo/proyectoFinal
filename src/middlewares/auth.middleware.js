export const privateRoutes = (req, res, next) => {
  if (req.session.user) return res.redirect("/profile");
  next();
};

export const publicRoutes = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

export const handlePolicies = (policies) => (req, res, next) => {
  if (policies.includes("PUBLIC")) return next();
  if (!req.session.user)
    return res
      .status(401)
      .json({ status: "error", error: "You are not logged-in" });
  if (policies.length > 0) {
    if (!policies.includes(req.session.user.role.toUpperCase())) {
      return res
        .status(403)
        .json({ status: "error", error: "You are not authorized" });
    }
  }
  next();
};
