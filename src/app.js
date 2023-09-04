import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import realTimeProductsRouter from "./routers/realtimeproducts.router.js";
import { Server } from "socket.io";
import ProductManager from "./contenedor/productManager.js";

const app = express();
const pm = new ProductManager("./src/contenedor/products.txt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuro la carpeta publica
app.use(express.static("./src/public"));

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

//Dispongo las rutas de los endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

const httpServer = app.listen(8080, () =>
  console.log(`Server Running in port ${httpServer.address().port}`)
);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  socket.on("productList", (data) => {
    console.log(data);
    io.emit("updateProduct", data);
  });
});
