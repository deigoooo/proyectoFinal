import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import chatRouter from "./routers/messages.router.js";
import userRouter from "./routers/users.router.js";
import loginRouter from "./routers/login.router.js";
import { Server } from "socket.io";
import initializeSocketIoServer from "./socket.js";
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
      mongoUrl: "mongodb://0.0.0.0:27017",
      dbName: "sessions",
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
  const io = new Server(httpServer);
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  //Dispongo las rutas de los endpoints
  app.get("/", (req, res) => res.render("index"));
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/users", userRouter);
  app.use("/products", viewRouter);
  app.use("/carts", viewRouter);
  app.use("/login", loginRouter);
  app.use("/chat", chatRouter);

  initializeSocketIoServer(io);

  //hasta aca
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
