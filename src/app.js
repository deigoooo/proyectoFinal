import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import run from "./run.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { Command } from "commander";
import flash from "express-flash";

//inicializo commander
const program = new Command();

program.option("-p <port>", "puerto del server", 8080);
program.option("--mode <mode>", "modo del server", "production");
program.option(
  "--persistance <persistance>",
  "persistencia del server",
  "MONGO"
);
program.parse();

//creo y exporto la variable PORT
export const PORT = program.opts().p;
//creo y exporto la variable PERSISTANCE
export const PERSISTENCE = program.opts().persistance;
//creo y exporto la variable MODE
export const MODE = program.opts().mode;

//inicializo dot env
dotenv.config({
  path: MODE === "production" ? "./.env.production" : "./.env.development",
});

//importo passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//inicializo el server
const app = express();

const URI_MONGO = process.env.URI_MONGO;
const DBNAME_MONGO = process.env.DBNAME_MONGO;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuro la carpeta publica
app.use(express.static("./src/public"));

//configuramos las sessions
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `${URI_MONGO}`,
      dbName: `${DBNAME_MONGO}`,
    }),
    secret: `${process.env.secret}`,
    resave: true,
    saveUninitialized: true,
  })
);

//configuro passport
initializePassport();
app.use(passport.initialize());

//inicializa las sessions
app.use(passport.session());

//inicializo flash
app.use(flash());

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

try {
  //conecto la base de datos
  await mongoose.connect(URI_MONGO, {
    dbName: `${DBNAME_MONGO}`,
    useUnifiedTopology: true,
  });
  console.log(`DB connected`);

  //desde aca
  const httpServer = app.listen(PORT, () =>
    console.log(`Server Running in port ${PORT} on ${MODE} mode`)
  );
  const socket = new Server(httpServer);

  run(socket, app);

  //hasta aca
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
