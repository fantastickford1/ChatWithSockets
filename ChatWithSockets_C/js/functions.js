jQuery(function($) {
  var socket = io.connect();
  var $nickForm = $('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#nickname');
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');
  var $users = $('#users');

  $nickForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user',$nickBox.val(), function(data){
      if (data) {
        $('#nickWrap').hide();
        $('#contentWrap').show();
      }else {
        $nickError.html('Snap!! That username is already taken!');
      }
    });
    $nickBox.val('');
  });

  socket.on('usernames', function(data){
    var html = '';
    for (var i = 0; i < data.length; i++) {
      html += data[i] + '<br/>'
    }
    $users.html(html);
  });

  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $messageBox.val(), function(data){
      $chat.append('<span class="error>'+ data + '</span><br/>');
    });
    $messageBox.val('');
  });

  function displayMsg(data) {
    $chat.append('<span class="msg"><b>'+ data.nick + ': </b>' + data.msg + '</span><br/>');
  }

  socket.on('load old messages', function(docs){
    for (var i = docs.length - 1; i >= 0; i--) {
      displayMsg(docs[i]);
    }
  });

  socket.on('new message', function(data){
    displayMsg(data);
  });

  socket.on('whisper', function(data){
    $chat.append('<span class="whisper"><b>'+ data.nick + ': </b>' + data.msg + '</span><br/>');
  });

});
