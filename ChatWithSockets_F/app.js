var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
mongoose = require('mongoose'),
users = {};

server.listen(3000);
mongoose.connect('mongodb://localhost/chat',function functionName(err) {
    if (err) {
        console.log(err);
    }else {
        console.log('Connected to mongodb');
    }
});

var chatSchema = mongoose.Schema({
    nick: String,
    msg: String,
    created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message',chatSchema);

app.get('/',function(req,res) {
    res.sendFile(__dirname+'/index.html')
})

app.use('/scripts',express.static(__dirname+'/node_modules/jquery/dist/'));
app.use('/material',express.static(__dirname+'/node_modules/material-design-lite'));
//app.use('/material/icons',express.static(__dirname+'/node_modules/material-design-icons'));
app.use('/scriptsApp',express.static(__dirname+'/js'));
app.use('/stylesheets',express.static(__dirname+'/css'));

io.sockets.on('connection',function(socket) {
    Chat.find({},function(err, docs) {
        if (err) {
            throw err;
        }else {
            //console.log('Sending olg msgs! :D');
            socket.emit('load olg msgs',docs);
        }
    });
    socket.on('new user', function functionName(data,callback) {
        if (data in users) {
            callback(false);
        }else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });

    function updateNicknames() {
        io.sockets.emit('usernames',Object.keys(users));
    }

    /* Broadcast message */
    socket.on('send message',function functionName(data, callback) {
        var msg = data.trim();
        if (msg.substr(0,3)==='/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                var name = msg.substring(0,ind);
                var msg = msg.substring(ind + 1);
                if (name in users) {
                    var newWMsg = new Chat({msg: msg, nick: socket.nickname});
                    newWMsg.save(function (err) {
                        if (err) {
                            throw err;
                        }
                    })
                    users[name].emit('whisper',{msg: msg, nick: socket.nickname})
                    console.log('Whisper!!');
                }else {
                    callback('Error! Enter a valid user.')
                }

            }else {
                callback('Error!! please enter a message for your Whisper');
            }

        }else {
            /* Send a message*/
            var newMsg = new Chat({msg: msg, nick: socket.nickname});
            newMsg.save(function (err) {
                if (err) {
                    throw err;
                }
            })
            io.sockets.emit('new message',{msg: msg, nick: socket.nickname});
        }

    });

    socket.on('disconnect',function functionName() {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });

});
