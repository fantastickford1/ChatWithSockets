var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose'),
    users = {};

server.listen(17181);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/html/index.html');
});

app.use('/material-lite', express.static(__dirname + '/node_modules/material-design-lite/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/script',express.static(__dirname + '/js/'));
app.use('/style',express.static(__dirname + '/css/'));

mongoose.connect('mongodb://localhost:27017/chat', function(err){
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to mongodb');
  }
});

var chatSchema = mongoose.Schema({
  nick: String,
  msg: String,
  created: { type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);


io.sockets.on('connection', function(socket){


  var query = Chat.find({});
  query.sort('-created').limit(10).exec(function(err, docs){
    if(err) throw err;
    socket.emit('load old messages', docs);
  });
  
  socket.on('new user', function(data, callback){
    if (data in users) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      users[socket.nickname] = socket;
      updateNicknames();
    }
  });

  function updateNicknames() {
    io.sockets.emit('usernames', Object.keys(users));
  }

  socket.on('send message', function(data, callback){
    var msg = data.trim();
    if (msg.substr(0,3) === '/w ') {
        msg = msg.substr(3);
        var ind = msg.indexOf(' ');
        if (ind !== -1) {
          var name = msg.substring(0, ind);
          var msg = msg.substring(ind + 1);
          if (name in users) {
            users[name].emit('whisper', { msg: msg, nick: socket.nickname});
          } else {
            callback('Error! Enter a valid user');
          }
        } else {
          callback('Error! Please enter a message');
        }
    }else {
      var newMsg = new Chat({msg: msg, nick: socket.nickname});
      newMsg.save(function(err){
        if(err) throw err;
        io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
      });
    }

  });

  socket.on('disconnect', function(data){
    if(!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});
