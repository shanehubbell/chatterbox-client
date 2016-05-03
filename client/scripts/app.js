// YOUR CODE HERE:

var url = 'https://api.parse.com/1/classes/messages';
var roomSelection;

// http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
var escapeHtml = function (str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

var app = {
  init: function() {
  },

  send: function (message, url, callback) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        callback();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function (url, callback) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'GET',
      //data: JSON.stringify(message),
      //contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message got');
        callback(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },

  clearMessages: function () {
    $('#chats').empty();
  },

  addMessage: function(message) {
    postMessage(message);
    //on submit, we need to grab the username, text, & roomname
    //wrap those in an object like below
    //then send those.
    //then get those messages & post in the chats section
  },

  addRoom: function (roomname) {

  },
};

var createMessage = function (text, username, roomname) {
  return {
    text: text,
    username: username,
    roomname: roomname
  };
};

$( document ).ready(function() {

  app.fetch(url, function (data) {
    updateRooms();
  });

  $('.submitButton').click(function() {
    app.clearMessages();
    var userInput = $('.userInput').val();
    var username = location.search.slice(10); // refactor this later to make it better
    var roomname = '';
    var message = createMessage(userInput, username, roomname);
    
    app.send(message, url, function() {
      postMessage();
    });
    
    $('.userInput').val('');

  });
  
  var postMessage = function (filterName) {
    app.fetch(url, function (data) {
      $('#chats').empty();
      for (var i = 0; i < data.results.length; i++) {
        var username = escapeHtml(data.results[i].username);
        var text = escapeHtml(data.results[i].text);
        var roomname = escapeHtml(data.results[i].roomname);
        if (filterName !== undefined) {
          if (filterName === roomname) {
            $('#chats').append('<div>Username: ' + username + ' Message: ' + text + ' Roomname: ' + roomname + '</div>');
          }
        } else {
          $('#chats').append('<div>Username: ' + username + ' Message: ' + text + ' Roomname: ' + roomname + '</div>');
        }
      }
      updateRooms();
    });
  };

  $('#roomNames').change(function () {
    roomSelection = $('#roomNames option:selected').text();
    postMessage(roomSelection);
  });

  var updateRooms = function (room) {

    app.fetch(url, function (data) {
      var roomNames = [];
      for (var i = 0; i < data.results.length; i++) {
        var roomname = escapeHtml(data.results[i].roomname);
        roomNames.push(roomname);
      }
      roomNames = _.uniq(roomNames);
      $('#roomNames').empty();
      _.each(roomNames, function(value, index, collection) {
        if (value === roomSelection) {
          $('#roomNames').append(`<option selected="selected">${value}</option>`);
        } else {
          $('#roomNames').append(`<option>${value}</option>`);
        }
      });
    });
  };

});


//filter rooms
//Add new rooms
//clear the page
//

//Input room name, then update the 

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };