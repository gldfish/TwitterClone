

let username;
let password;
let token;

document.getElementById('nextButton').addEventListener('click', function() {
    
    // Get username
    username = document.querySelector('.login--input-field[placeholder="Username"]').value;
    
    // Get password
    password = document.querySelector('.login--input-field[placeholder="Password"]').value;

    // login
    login().then(() => {
        if (token) {
            window.location.href = 'feed.html';
        } else {
            console.log("Token is null. Login failed.");
        }
    });
});


// login backend
async function login() {
    event.preventDefault();

    var raw = JSON.stringify({
        "username": username,
        "password": password
    });

    var fetchRequest = {
        method: 'POST',
        body: raw,
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        // fetch
        const response = await fetch("http://localhost:3000/api/v1/auth/login", fetchRequest);
        const result = await response.text();
        if (result) {
            console.log(result);
            token = "Bearer " + result;   
            // save user
            saveUser(username, password, token);
        } else {
            console.log("Error: Result is undefined or empty.");
        }
    } catch (error) {
        console.log('error', error);
    }
}


// save user
function saveUser(username, password, token) {
    console.log("saveuser")
    console.log("TOKENTOKEN", token)
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    existingUsers[username] = { password: password, token: token };

    localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser', username);

}


// function getExistingUser(username) {
//     const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

//     // console.log(existingUsers);

//     return existingUsers[username];
// }