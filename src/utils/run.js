import productsRouter from "../routers/products.router.js";
import cartsRouter from "../routers/carts.router.js";
import viewRouter from "../routers/view.router.js";
import chatRouter from "../routers/messages.router.js";
import sessionRouter from "../routers/session.router.js";
import mockingRouter from "../routers/mocking.router.js";
import loggerTestRouter from "../routers/loggerTest.router.js";
import usersRouter from "../routers/users.router.js";
import errorHandler from "../middlewares/error.middleware.js";
import { messageService,userService } from "../services/Factory.js";

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
  app.use("/mockingproducts", mockingRouter);
  app.use("/loggerTest", loggerTestRouter);

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/users", usersRouter);

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
    socket.on("updateUser", async (data) => {
      console.log(`entro al socket`)
      const users = await userService.getAll();
      const response = users.map((user) => {
        return new UserGetDTO(user);
      });
      socketServer.emit("updateUser", response);
    });
  });

  app.use("/", (req, res) => res.redirect("/session/login"));

  //aplico el middleware de error
  app.use(errorHandler);
};

export default run;
