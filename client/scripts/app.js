// YOUR CODE HERE:

var url = 'https://api.parse.com/1/classes/messages';

var app = {
  init: function() {
  },

  send: function (message, url) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function (url) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: url,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message got');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },

  clearMessages: function () {
  },

  addMessage: function(message) {

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

  $('.submitButton').click(function() {
    var userInput = $('.userInput').val();
    var username = location.search.slice(10); // refactor this later to make it better
    var roomname = '';
    var message = createMessage(userInput, username, roomname);
    
    console.log(message);
    $('.userInput').val('');
  });
  
});



// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };