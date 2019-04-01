const socketIO = require('socket.io');

module.exports = server => {
  const io = socketIO(server);

  io.on('connection', socket => {
    socket.on('joinRoom', room => {
      socket.join(room);
      const roomObj = io.sockets.adapter.rooms[room];
      let usersInRoom = roomObj.length;
      socket.emit('usersCount', usersInRoom)
      socket.broadcast.to(room).emit('userJoined', usersInRoom);

      socket.on('typing', (isTyping) => {
        socket.broadcast.to(room).emit('typing', isTyping);
      });

      socket.on('sentMsg', msg => {
        socket.broadcast.to(room).emit('incomingMsg', msg);
      });

      socket.on('disconnect', () => {
        usersInRoom = roomObj ? roomObj.length : 0;
        io.to(room).emit('userLeft', usersInRoom);
      });
    });
  });
}