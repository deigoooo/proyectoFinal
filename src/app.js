import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import run from "./run.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

//declaro la url de conexion
const URI_MONGO = "mongodb://0.0.0.0:27017";
const DBNAME_MONGO = "ecommerce";
export const PORT = 8080;

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
    secret: "victoriasecret",
    resave: true,
    saveUninitialized: true,
  })
);

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
    console.log(`Server Running in port ${httpServer.address().port}`)
  );
  const socket = new Server(httpServer);

  run(socket, app);

  //hasta aca
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
