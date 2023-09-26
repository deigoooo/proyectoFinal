import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import realTimeProductsRouter from "./routers/realtimeproducts.router.js";
import chatRouter from "./routers/messages.router.js";
import { Server } from "socket.io";
/* import ProductManager from "./dao/fileSystem/productManager.js"; */
import mongoose from "mongoose";

const app = express();
/* const pm = new ProductManager("./src/dao/fileSystem/products.txt"); */

//declaro la url de conexion
const uri = "mongodb://0.0.0.0:27017";

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
  await mongoose.connect(uri, {
    dbName: "ecommerce",
    useUnifiedTopology: true,
  });
  /*   app.use((req, re, next) => {
    req.io = io;
    next();
  }); */
} catch (error) {
  console.log(`No se pudo conectar con la BD error: ${error.message}`);
}

//Dispongo las rutas de los endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/chat", chatRouter);

//Configuro el server
const httpServer = app.listen(8080, () =>
  console.log(`Server Running in port ${httpServer.address().port}`)
);

//conexion con el socket
const io = new Server(httpServer);

const messages = [];

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  socket.on("productList", (data) => {
    io.emit("updateProduct", data);
  });
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("logs", messages);
  });
});
