import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  if (req.session.user?.role === "admin" || req.session.user?.role === "user") {
    next();
  } else {
    res.send("Not allowed!");
  }
};

export const authToken = (req, res, next) => {
  // const token = req.headers.auth
  const token = req.signedCookies["jwt-user"];
  if (!token) return res.status(401).send({ error: "Not Auth" });
  jwt.verify(token, "secret", (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not Authorized" });
    req.user = credentials.user;
    next();
  });
};
