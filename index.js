"use strict";
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'src')));

let users = [];

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    if (users.some((item) => item.username === `${username}`)) {
      io.emit("Name is already taken", username);
    } else {
      console.log(username, "is available");
      users.push({ username: username, id: socket.id });
      io.emit("new user", username);
    }
  });

  socket.on("disconnect", () => {
    const disconnectedData = users.find((item) => item.id === `${socket.id}`);
    const disconnectedName = disconnectedData.username;
    io.emit("remove from usernames", disconnectedName);
    users = users.filter((item) => item.id !== `${socket.id}`);
  });

  socket.on("message", ({ message }) => {
    console.log({ message });
    io.emit("message", message);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));