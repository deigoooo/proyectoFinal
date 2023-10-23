import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../util.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstname, lastname, email, age } = req.body;
        try {
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false, {
              message: "El nombre de usuario ya existe",
            });
          }
          const newUser = {
            firstname,
            lastname,
            email,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

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
            const newAdmin = {
              firstname: "CoderHouse",
              lastname: "Academia",
              email: "adminCoder@coder.com",
              password: createHash("adminCod3r123"),
              role: "admin",
            };
            await userModel.create(newAdmin);
          }
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, user);
          }
          if (!isValidPassword(user, password)) {
            return done(false, false);
          }
          return done(null, user);
        } catch (error) {
          return done(err);
        }
      }
    )
  );

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
          const user = await userModel.findOne({ email: profile._json.email });

          if (user !== null) {
            return done(null, user);
          }
          const newUser = await userModel.create({
            firstname: profile._json.name,
            lastname: "",
            age: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github");
        }
      }
    )
  );

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
          const newUser = await userModel.create({
            firstname: profile._json.name,
            lastname: "",
            age: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (err) {
          return done("Error to login with github");
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
