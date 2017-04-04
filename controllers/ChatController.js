import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import User from '../models/User';
import ChatRepository from '../repositories/ChatRepository'
import UserRepository from '../repositories/UserRepository'
import _ from 'lodash'

export default function(server) {
  var io = require('socket.io')(server);
  var chatRepo = new ChatRepository;
  var userRepo = new UserRepository;


  io.on('connection', function(socket){
    var userSend = socket.decoded;
    var userReceive = socket.handshake.query.user_id;

    userRepo.updateSocketId(userSend.id, socket.id);

    socket.emit('userCurrent', socket.decoded);

    chatRepo.getMessageByMember(userSend.id, userReceive).then(function(results) {
      socket.emit('messages', results);
    });

    socket.on('receive_new_message', function(data) {
      chatRepo.addNewMessage(data, userSend.id).then(function(message) {
        userRepo.findOne(userReceive).then(function(user) {
          // io.sockets.socket(user.socket_id).emit('broadcast_message', message);
          io.clients[user.socket_id].send('broadcast_message', message);
        });
      });
    });

    socket.on('disconnect', function() {
      console.log('socket disconnect');
    });
  });

  io.listen(3001);

  io.use(function(socket, next){
    var token = socket.handshake.query.token;

    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.KEY_SECRET, function(err, decoded) {
        if (err) {
          next(new Error("not authorized"));
        } else {
          // if everything is good, save to request for use in other routes
          socket.decoded = decoded;
          next();
        }
      });

    } else {
      next(new Error("not authorized"));
    }
  });
}

