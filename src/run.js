import MessageManager from "./dao/DB/messageManager.js";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import chatRouter from "./routers/messages.router.js";
import userRouter from "./routers/users.router.js";
import loginRouter from "./routers/view.login.router.js";

//hasrcode el modelo de message
const message = new MessageManager();

const run = (socketServer, app) => {
  app.use((req, res, next) => {
    req.io = socketServer;
    next();
  });

  app.use("/products", viewRouter);
  app.use("/carts", viewRouter);
  app.use("/chat", chatRouter);
  app.use("/login", loginRouter);

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/users", userRouter);

  socketServer.on("connection", async (socket) => {
    socketServer.emit("logs", await message.getMessage());
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      socketServer.emit("updateProduct", data);
    });
    socket.on("message", async (data) => {
      message.addMessage(data);
      socketServer.emit("logs", await message.getMessage());
    });
  });

  app.use("/", (req, res) => res.send("HOME"));
};

export default run;
