import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import realTimeProductsRouter from "./routers/realtimeproducts.router.js";
import { Server } from "socket.io";
import __dirname from "./util.js";
import ProductManager from "./contenedor/productManager.js";

const app = express();
const pm = new ProductManager("./src/contenedor/products.txt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuro la carpeta publica
app.use(express.static(__dirname + "/public"));

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Dispongo las rutas de los endpoints
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

const httpServer = app.listen(8080, () => console.log("Server Running..."));
const io = new Server(httpServer);

io.on("connection", async (socketClient) => {
  console.log(`Nuevo cliente conectado: ${socketClient.id}`);

  socketClient.emit("userId", `${socketClient.id}`);
  socketClient.emit("products", await pm.getProduct());

  socketClient.on("add", async (product) => {
    let response = await pm.addProduct(product);
    console.log(response);
  });
  socketClient.on("delete", async (id) => {
    let response = await pm.deleteProduct(id);
    console.log(response);
  });
});
