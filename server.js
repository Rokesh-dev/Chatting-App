require("dotenv").config();
const express = require("express");


const app = express();
app.use(express.json());

const { dbClient } = require("./common");
dbClient();

const { admin, users, chats, messages } = require("./modules");
app.use("/api/admin", admin);
app.use("/api/user", users);
app.use("/api/chat", chats);
app.use("/api/message", messages);

const { notFound, errorHandler } = require("./middleware");
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log(`Starting server at ${process.env.PORT} PORT`)
);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  pingTimeout: 120000,
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat[0]; // Change it to object

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
