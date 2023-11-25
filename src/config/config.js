import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("-p <port>", "puerto del server", 8080);
program.option("--mode <mode>", "modo del server", "production");
program.option(
  "--persistance <persistance>",
  "persistencia del server",
  "MONGO"
);
program.parse();

dotenv.config({
  path:
    program.opts().mode === "production"
      ? ".env.production"
      : ".env.development",
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
  PORT: program.opts().p,
  MODE: program.opts().mode,
};
