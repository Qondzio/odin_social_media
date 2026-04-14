function socketHandler(io) {

    io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      return next(new Error("Unauthorized"));
    }

    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    console.log('Connected: ', socket.userId);
    socket.join(`user:${socket.userId}`);

    socket.on('disconnect', () => {
      console.log("Client disconnected:", socket.userId);
    });

  });
}

module.exports = socketHandler;