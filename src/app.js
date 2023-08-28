import express from "express";
import handlebars from "express-handlebars";
import productsRoutrer from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import realTimeProductsRouter from "./routers/realtimeproducts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//configuro handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRoutrer);
app.use("/api/carts", cartsRouter);
app.use("/api/realtimeproducts", realTimeProductsRouter);

app.listen(8080, () => console.log("Server Running..."));
