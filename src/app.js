import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import run from "./run.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import cors from "cors";
import compression from "express-compression";
// import errorHandler from "./middlewares/error.js";

import config from "./config/config.js";

//importo passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";

//inicializo el server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuramos los cors
app.use(cors());

//configuramos compression
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

//configuro la carpeta publica
app.use(express.static("./src/public"));

//configuramos las sessions
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `${config.mongo.url}`,
      dbName: `${config.mongo.db_name}`,
    }),
    secret: `${config.mongo.secret}`,
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
// app.use(errorHandler);

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

try {
  //conecto la base de datos
  await mongoose.connect(config.mongo.url, {
    dbName: `${config.mongo.db_name}`,
    useUnifiedTopology: true,
  });
  console.log(`DB connected`);

  //desde aca
  const httpServer = app.listen(config.PORT, () =>
    console.log(`Server Running in port ${config.PORT} on ${config.MODE} mode`)
  );
  const socket = new Server(httpServer);

  run(socket, app);

  //hasta aca
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
