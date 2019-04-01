const socketIO = require('socket.io');

module.exports = server => {
  const io = socketIO(server);

  io.on('connection', socket => {
    socket.on('joinRoom', room => {
      socket.join(room);
      socket.broadcast.to(room).emit('userJoined');

      socket.on('typing', (isTyping) => {
        socket.broadcast.to(room).emit('typing', isTyping);
      });

      socket.on('sentMsg', msg => {
        socket.broadcast.to(room).emit('incomingMsg', msg);
      });

      socket.on('disconnect', () => {
        socket.leave(room);
        io.to(room).emit('userLeft');
      });
    });
  });
}