$(document).ready(function() {
    //console.log( "document ready!" );

    /* connection to server*/
    var socket= io.connect();

    /* instance of components*/
    var $messageForm = $('#send-message');
    var $messageBox = $('#message');
    var $chat = $('#chat');

    var $nickForm = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#nickname');
    var $users = $('#users');

    /*
    $('#nickButton').click(function() {
        //e.preventDefault();
        socket.emit('new user', $nickBox.val(),function(data) {
            if (data) {
                console.log("data ->" + data);
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else {
                $nickError.html('That user name is alrready taken: Try again.');
            }
        });
        $nickBox.val('');

    });
    */
    $nickForm.submit(function functionName(e) {
        e.preventDefault();
        socket.emit('new user', $nickBox.val(),function(data) {
            if (data) {
                console.log("data ->" + data);
                $('#nickWrap').hide();
                $('#contentWrap').show();
            }else {
                $nickError.html('That user name is alrready taken: Try again.');
            }
        });
        $nickBox.val('');
    });

    socket.on('usernames',function functionName(data) {
        var html =[];
        for (var i = 1; i < data.length; i++) {
            var spn = $('<span class="mdl-chip"><span class="mdl-chip__text">'+data[i]+'</span></span>');
            html[i] = spn;
        }
        //console.log(html);
        $users.html(html);
    });


    /* Send a new message*/
    $messageForm.submit(function functionName(e) {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(),function functionName(data) {
            $chat.append('<span class= "error">'+data + "</sapan><br/>" );
        });
        $messageBox.val('');
    });
    /* Recive a new message*/
    socket.on('new message', function functionName(data) {
        displayMsgs(data);
    });

    /* Recive old messages */
    socket.on('load olg msgs', function (olds) {
        for (var i = 0; i < olds.length; i++) {
            displayMsgs(olds[i]);
        }
    });

    function displayMsgs(msgs) {
        $chat.append('<b>'+msgs.nick + ": " );
        $chat.append(msgs.msg + '<br/>');
    }

    /* Whisper */
    socket.on('whisper',function functionName(data) {
        $chat.append('<span class="whisper"><b>'+data.nick + ": </b>" );
        $chat.append(data.msg + '<br/>');
    });
});
