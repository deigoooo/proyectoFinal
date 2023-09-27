import { Server } from "socket.io";
import MessageManager from "./dao/DB/messageManager.js";

//hasrcode el modelo de message
const message = new MessageManager();

function initializeSocketIoServer(io) {
  io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);
    socket.on("productList", (data) => {
      io.emit("updateProduct", data);
    });
    socket.on("message", async (data) => {
      message.addMessage(data);
      const newMessage = await message.getMessage();
      io.emit("logs", newMessage);
    });
  });
}
export { initializeSocketIoServer };
