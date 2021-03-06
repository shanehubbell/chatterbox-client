// YOUR CODE HERE:

var url = 'https://api.parse.com/1/classes/messages';
var roomSelection, username;
var friendList = [];




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

  handleSubmit: function () {

  },

  clearMessages: function () {
    $('#chats').empty();
  },

  addMessage: function(message) {
    $('#chats').append('<div>Username: ' + message.username + ' Message: ' + message.text + ' Roomname: ' + message.roomname + '</div>');
  },

  addFriend: function (friend) {
    
    friendList.push(friend);
    friendList = _.uniq(friendList);
    $('#friendList').empty();
    _.each(friendList, function(value, index, collection) {
      $('#friendList').append(`<option class="${value}">${value}</option>`);
    });
    app.setLocalStorage();
  },

  addRoom: function (roomname) {
    $('#roomSelect').append(`<option>${roomname}</option>`);
  },

  setLocalStorage: function () {
    // if (localStorage.length > 0) {
    friendListString = JSON.stringify(friendList);
    localStorage.friends = friendListString;
    localStorage.username = location.search;
    localStorage.room = roomSelection;
    // }
  },

  updateStoredVariables: function () {
    if (localStorage.length > 0) {
      friendList = JSON.parse(localStorage.friends);
      username = location.search;
      roomSelection = localStorage.room;
    }
  },

  fetchWithParam: function (url, callback) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'GET',
      data: {where:{
        "roomname":"lobby","username":{
          "$ne":"drewKosta"}}},
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

// where={"hometown":
//         {"$select":
//           {"query":
//             {"className":"Team","where":
//               {"winPct":
//                 {"$gt":0.5}}},"key":"city"}}}

  }

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
    var roomname = $('.roomInput').val() || roomSelection;
    var message = createMessage(userInput, username, roomname);

    app.send(message, url, function() {
      postMessage(roomname);
    });

    $('.userInput').val('');
    $('.roomInput').val('');
    app.setLocalStorage();
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
            $('#chats').append('<div>Username: ' + '<span class="username">' + username + '</span>' + ' Message: ' + text + ' Roomname: ' + roomname + '</div>');
          }
        } else {
          $('#chats').append('<div>Username: ' + '<span class="username">' + username + '</span>' + ' Message: ' + text + ' Roomname: ' + roomname + '</div>');
        }
      }
      $('.roomInput').hide();
      roomSelection = filterName;
      updateRooms(filterName);
      $('.username').click( function() { 
        var friend = $(this).text();
        app.addFriend(friend);
      }); 
    });
  };

  $('#roomSelect').change(function () {
    roomSelection = $('#roomSelect option:selected').text();
    if (roomSelection === 'New Room...') {
      $('.roomInput').show();
    } else {
      postMessage(roomSelection);
      $('.roomInput').hide();
    }
    app.setLocalStorage();
  });

  var updateRooms = function (filterName) {

    app.fetch(url, function (data) {
      var roomNames = [];
      for (var i = 0; i < data.results.length; i++) {
        var roomname = escapeHtml(data.results[i].roomname);
        roomNames.push(roomname);
      }
      roomNames = _.uniq(roomNames);
      $('#roomSelect').empty();
      $('#roomSelect').append('<option class="newRoom">New Room...</option>');
      _.each(roomNames, function(value, index, collection) {
        if (value === roomSelection) {
          $('#roomSelect').append(`<option class="${value}" selected="selected">${value}</option>`);
        } else {
          $('#roomSelect').append(`<option class="${value}">${value}</option>`);
        }
      });
    });
    app.setLocalStorage();
  };

  $('.newTab').click( function() { 
    app.fetchWithParam(url, function(data){console.log(data)});
    //window.open('file:///Users/student/Desktop/2016-04-chatterbox-client/client/index.html' + location.search);    
  }); 

  // new tab function
  app.updateStoredVariables();
  updateRooms(roomSelection);


});

//Advanced content

//******  New Tab *****************
//If we open a new tab, we need to pass in the friend list, and current room to the new version

//******** Unread Messages ******************
//Use a setTimeOut function to refresh the page every 15 second.  If the users's attention
//is not on the page, then push the number of NEW messages to the title e.g. (5)

