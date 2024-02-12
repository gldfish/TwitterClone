// collection of news
let newsColl = [];

function setNewsColl(data) {
    newsColl = data;
}


// collection of users
let users = {};

// collection of current username
let currUsernameRegistered = ["sample"];


export {
    users,
    newsColl,
    currUsernameRegistered,
    setNewsColl
};