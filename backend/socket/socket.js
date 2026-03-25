export const initSocket = (io) => {
  const userSocketMap = {};
  console.log("Socket.Io initialized");

  io.on("connection", (socket) => {
    // console.log("User Connected");

    // Register's User socket
    socket.on("userOnline", (username) => {
      userSocketMap[username] = socket.id;
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
    // send message to a specific receiver
    socket.on("sendMessage", (data) => {
      const receiverSocketId = userSocketMap[data.receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", data);
      }
      socket.emit("receiveMessage", data);
    });
    socket.on("disconnect", () => {
      // Remove Users from socket
      for (const [username, id] of Object.entries(userSocketMap)) {
        if (id === socket.id) {
          delete userSocketMap[username];
          break;
        }
      }
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });
};