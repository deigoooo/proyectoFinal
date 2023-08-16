import express from "express";
import productsRoutrer from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoutrer);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => console.log("Server Running..."));
