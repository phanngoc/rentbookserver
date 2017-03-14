const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDJTp4oCTK25hqttkGds4ZzW-acvory82A",
  authDomain: "rentbook-b7ec6.firebaseapp.com",
  databaseURL: "https://rentbook-b7ec6.firebaseio.com",
  storageBucket: "rentbook-b7ec6.appspot.com",
  messagingSenderId: "39058167660"
};

module.exports = firebase.initializeApp(config);
