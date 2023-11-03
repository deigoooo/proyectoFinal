import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import jwt, { ExtractJwt } from "passport-jwt";
import userModel from "../dao/models/user.model.js";
import cartManager from "../dao/DB/cartManager.js";
import { createHash, isValidPassword } from "../util.js";

const cm = new cartManager();

const localStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const cookieExtractor = (req) =>
  req && req.signedCookies ? req.signedCookies["jwt-user"] : null;

const initializePassport = () => {
  //registro con pasport local
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false, {
              message: "El nombre de usuario ya existe",
            });
          }
          const newCart = await cm.addCart();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            carts: [{ cart: newCart._id }],
          };

          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //login con passport local
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const admin = await userModel.findOne({
            email: "adminCoder@coder.com",
          });
          if (!admin) {
            const newCart = await cm.addCart();
            const newAdmin = {
              first_name: "CoderHouse",
              last_name: "Academia",
              email: "adminCoder@coder.com",
              password: createHash("adminCod3r123"),
              role: "admin",
              carts: [{ cart: newCart._id }],
            };
            await userModel.create(newAdmin);
          }
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done("Usuario Inexistente", null);
          }
          if (!isValidPassword(user, password)) {
            return done("Contraseña Incorrecta", false);
          }
          return done(null, user);
        } catch (error) {
          return done(err);
        }
      }
    )
  );

  //login con github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.d204e627d3471f21",
        clientSecret: "ed99006c67f403364f08177af187300827e6d761",
        callbackURL: "http://localhost:8080/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel
            .findOne({ email: profile._json.email })
            .populate("carts.cart")
            .lean();
          if (user !== null) {
            return done(null, user);
          }
          const newCart = await cm.addCart();
          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email: profile._json.email,
            password: "",
            carts: [{ cart: newCart._id }],
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github");
        }
      }
    )
  );

  //login con google
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID:
          "857467492399-o7t38sq453jvhv2eb6qnms7fmhjlvceh.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/session/googlecallback",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (user) return done(null, user);
          const newCart = await cm.addCart();
          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email: profile._json.email,
            password: "",
            carts: [{ cart: newCart._id }],
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with google");
        }
      }
    )
  );

  //login con jwt
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "secret",
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload);
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
