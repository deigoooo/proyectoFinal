import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../models/user.model.js";
import { cartService } from "../services/Factory.js";
import { createHash, isValidPassword } from "../utils/util.js";
import config from "../config/config.js";

const localStrategy = local.Strategy;

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
            return done(
              null,
              false,
              req.flash("error", "The email has already been registered")
            );
          }
          if (!password) {
            return done(
              null,
              false,
              req.flash("error", "The user must have a password")
            );
          }
          const newCart = await cartService.create();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            carts: { cart: newCart._id },
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
            const newCart = await cartService.create();
            const newAdmin = {
              first_name: "CoderHouse",
              last_name: "Academia",
              email: "adminCoder@coder.com",
              password: createHash("adminCod3r123"),
              role: "admin",
              carts: { cart: newCart._id },
            };
            await userModel.create(newAdmin);
          }
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false, {
              message: "Nombre de usuario no registrado",
            });
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, {
              message: "Contraseña Incorrecta",
            });
          }
          user.last_connection = Date.now();
          await userModel.findByIdAndUpdate(user._id, user);
          return done(null, user);
        } catch (err) {
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
        clientID: config.github.github_client_id,
        clientSecret: config.github.github_client_secret,
        callbackURL: `http://localhost:${config.PORT}/session/githubcallback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel
            .findOne({ email: profile._json.email })
            .populate("carts.cart")
            .lean();
          if (user !== null) {
            user.last_connection = Date.now();
            await userModel.findByIdAndUpdate(user._id, user);
            return done(null, user);
          }
          const newCart = await cartService.create();
          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email: profile._json.email,
            password: "",
            carts: { cart: newCart._id },
            last_connection: Date.now(),
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
        clientID: config.google.google_client_id,
        clientSecret: config.google.google_client_secret,
        callbackURL: `http://localhost:${config.PORT}/session/googlecallback`,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (user !== null) {
            user.last_connection = Date.now();
            await userModel.findByIdAndUpdate(user._id, user);
            return done(null, user);
          }
          const newCart = await cartService.create();
          const newUser = await userModel.create({
            first_name: profile._json.name,
            last_name: "",
            age: "",
            email: profile._json.email,
            password: "",
            carts: { cart: newCart._id },
            last_connection: Date.now(),
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with google");
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
