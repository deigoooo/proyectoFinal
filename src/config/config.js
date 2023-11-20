import dotenv from "dotenv";
import { MODE } from "../app.js";

dotenv.config({
  path: MODE === "production" ? "../.env.production" : "../.env.development",
});

export default {
  app: {
    persistence: process.env.PERSISTENCE,
  },
  mongo: {
    url: process.env.URI_MONGO,
    db_name: process.env.DBNAME_MONGO,
    secret: process.env.SECRET,
  },
  github: {
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
  },
  google: {
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  },
};
