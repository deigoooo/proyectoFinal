import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

export const JWT_PRIVATE_KEY = "secret";
export const JWT_COOKIE_NAME = "myCookie";

//crea el hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//valida el password
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

//Genera token
export const generateToken = (user) =>
  jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: "24h" });

//extractor de cookies
export const extractCookie = (req) =>
  req && req.cookies ? req.cookies[JWT_COOKIE_NAME] : null;

//autentica el token
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .render("errors/base", { error: "No tengo token!" });
      req.user = user;
      next();
    })(req, res, next);
  };
};
