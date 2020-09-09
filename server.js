// Node Js Path Module
const path = require('path');
// importing HTTP module
const http = require('http')
// importing the express js
const express = require("express")
// importing socket.io
const socketio = require('socket.io')
// this is used to format the message
const formatMessage = require('./utility/messages')
// this is used to format the user details from user.js
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utility/users')


const  app = express ();
// create server using http module
const server = http.createServer(app);
// socketio
const io = socketio(server)
// Setting a Static folder
app.use(express.static(path.join(__dirname,'public')));
// BotNAME used while sending message from server side
const botName = 'ChitChatBot'
// Start when the client enters
io.on('connection',socket =>{
    // Here we are going to write a function which catches the information which has been emmited from the main.js from the place of Join the chat room
    socket.on('joinRoom',({username, room}) =>{
        // socket.id refers to the user id.
    const user = userJoin(socket.id,username, room);
    
    socket.join(user.room);

    // Sent message when client logs in to the current user
    socket.emit('message', formatMessage(botName,"Welcome to Siva's Chat Application! "));

    // Broadcast  when client connects (it sends the message excetp the client who is joined)
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    // Send the users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })
    });

    // Listen from chatbox msg
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);
        // here we are getting the currend user by using ther socket.id and delevering to the realtime chat 
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })
    // Runs when client disconnects
     socket.on('disconnect',() =>{
        const  user = userLeave(socket.id);
        if (user){
            io.to(user.room).emit("message", formatMessage(botName,`${user.username} has left the chat`))
        // Send the users and room info
            io.to(user.room).emit('roomUsers',{
              room: user.room,
              users: getRoomUsers(user.room)
            });
        }
    });
});
// Declaring the custom server PORT number
const PORT = process.env.PORT || 80;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

