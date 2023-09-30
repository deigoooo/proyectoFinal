import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import realTimeProductsRouter from "./routers/realtimeproducts.router.js";
import chatRouter from "./routers/messages.router.js";
import { Server } from "socket.io";
import initializeSocketIoServer from "./socket.js";
import mongoose from "mongoose";

const app = express();

//declaro la url de conexion
const URI_MONGO = "mongodb://0.0.0.0:27017";
const DBNAME_MONGO = "ecommerce";
export const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuro la carpeta publica
app.use(express.static("./src/public"));

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
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/realtimeproducts", realTimeProductsRouter);
  app.use("/chat", chatRouter);

  initializeSocketIoServer(io);

  //hasta aca
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
  process.exit(-1);
}
