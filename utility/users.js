const users =[];

// Join user to chat
function userJoin(id, username, room){
    const user = {id, username,room};
    users.push(user);

    return user;
}

// Get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// UserLeave chat
function userLeave(id){
    // to do this we need to remove the user from the array so wee need do this
    const index = users.findIndex(user => user.id === id)
    // we are using the 0 here because we are returning the user
    if(index !== -1){
        return users.splice(index,1)[0];
    }

}
// Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}