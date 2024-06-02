const express = require('express');
const app = express();
const socket = io.connect('http://127.0.0.1:5500/');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Replace with your client's origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('messageContainer');
var audio = new Audio('mixkit-sci-fi-click-900.mp3');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message', position);

  messageContainer.appendChild(messageElement);
  if (position === 'left') {
    audio.play();
  }
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'right'); // Corrected function name
  socket.emit('send', message);
  messageInput.value = '';
});

const username = document.getElementById('username').value;
socket.emit('new-user-joined', username);

socket.on('user-joined', (username) => {
  append(`${username} joined the chat`, 'right');
});

socket.on('receive', (message) => {
  // Handle received messages here
  console.log(`Received message: ${message}`);
  // You can update your UI or perform any other actions with the received data
});
socket.on('left', (username) => {
  append(`${username} left the chat`, 'left');
});
