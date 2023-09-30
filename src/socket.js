import MessageManager from "./dao/DB/messageManager.js";

//hasrcode el modelo de message
const message = new MessageManager();

function initializeSocketIoServer(io) {
  io.on("connection", async (socket) => {
    io.emit("logs", await message.getMessage());
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      io.emit("updateProduct", data);
    });
    socket.on("message", async (data) => {
      message.addMessage(data);
      io.emit("logs", await message.getMessage());
    });
  });
}
export default initializeSocketIoServer;
