import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//crea el hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//valida el password
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

//Genera token
export const generateToken = (user) =>
  jwt.sign({ user }, "secret", { expiresIn: "24h" });

//autentica el token
export const authToken = (req, res, next) => {
  // const token = req.headers.auth
  const token = req.signedCookies["jwt-coder"];
  if (!token) return res.status(401).send({ error: "Not Auth" });
  jwt.verify(token, "secret", (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not Authorized" });
    req.user = credentials.user;
    next();
  });
};
