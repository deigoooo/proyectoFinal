let socket = io();

let chatbox = document.getElementById("chatbox");
chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", {
        user: document.getElementById("username").innerText,
        message: chatbox.value,
      });
      chatbox.value = "";
    }
  }
});

socket.on("logs", (data) => {
  const divLogs = document.getElementById("log");
  let messages = "";
  data.reverse().forEach((message) => {
    messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
  });
  divLogs.innerHTML = messages;
});
