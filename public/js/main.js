// Collecting the data from form input in chat aplication
const chatForm = document.getElementById('chat-form');
// We are going to import the chat messages div from the chat.html for enabling the scroll down feature
const  chatMessage = document.querySelector('.chat-messages') 
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get Username and Room from URL using QS library which is imported in the chat.html
const { username, room } = Qs.parse(location.search,{
//    this is used inorder to prevent reading the unwanted special symbols while reading data  from the URL
    ignoreQueryPrefix: true
});

const socket = io();

// Join the chat room
socket.emit('joinRoom',{ username, room }) //this emits the information of the user and the the room which the user joined 

// Get room and users
socket.on('roomUsers',({ room, users }) =>{
    // these are DOM functions
    outputRoomName(room);
    outputUsers(users);
})

// This recives all the msg inside the applicationthis has the power loging all the msg
// Messahe from the server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);
    // After getting the screen full of messages we have to scroll down automatically
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Message submit from chatbox field
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    //Emit message to server 
    socket.emit('chatMessage', msg);

    // clear the input from input text field from the UI and focus the input field to empty;
     e.target.elements.msg.value ='';
     e.target.elements.msg.focus();

});

// output msg to Dom
function outputMessage(message){
    const div = document.createElement('div');
    // Here we are using this because each and every message passed using the class name message. 
    // Each passes through the div class name message to respond in the UI
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
document.querySelector('.chat-messages').appendChild(div);
}

// Add room Name to DOM in the left hand side
function outputRoomName(){
    roomName.innerText = room;
}

// Add users to DOM in the left hand side
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}