import { messageService } from "./services/Factory.js";
import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import viewRouter from "./routers/view.router.js";
import chatRouter from "./routers/messages.router.js";
import sessionRouter from "./routers/session.router.js";
//import users from "./routers/user.js";

//hardcodeo el modelo de message
//const message = new MessageManager();

//middleware de SocketIO
const run = (socketServer, app) => {
  app.use((req, res, next) => {
    req.io = socketServer;
    next();
  });

  //endpoints
  app.use("/products", viewRouter);
  app.use("/carts", viewRouter);
  app.use("/chat", chatRouter);
  app.use("/session", sessionRouter);

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);

  //prueba
  // app.use("/users", users);

  //configuracion del socket
  socketServer.on("connection", async (socket) => {
    socketServer.emit("logs", await messageService.getAll());
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      socketServer.emit("updateProduct", data);
    });
    socket.on("message", async (data) => {
      messageService.create(data);
      socketServer.emit("logs", await messageService.getAll());
    });
  });

  app.use("/", (req, res) => res.redirect("session/login"));
};

export default run;
