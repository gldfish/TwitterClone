let userUsername;
let userPassword;
let token;

document.getElementById('nextButton').addEventListener('click', function() {
    
    // Get username
    userUsername = document.querySelector('.login--input-field[placeholder="Username"]').value;
    
    // Get password
    userPassword = document.querySelector('.login--input-field[placeholder="Password"]').value;

    //validation if username or password is blank
    if ( !userUsername.trim() || !userPassword.trim()) {
        alert("Please enter both username and password!");
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    if (!existingUsers.hasOwnProperty(userUsername)) {
        alert("Username is not registered yet!");
        return;
    }
    
    if (userPassword !== existingUsers[userUsername].password) {
        alert("Wrong Password!");
        return;
    }

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
        "username": userUsername,
        "password": userPassword
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

            updateToken(userUsername, token);
        } else {
            console.log("Error: Result is undefined or empty.");
        }
    } catch (error) {
        console.log('error', error);
    }
}


// // save user
// function saveUser(username, password, token) {
//     console.log("saveuser")
//     console.log("TOKENTOKEN", token)
//     const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

//     existingUsers[username] = { password: password, token: token };

//     localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
//     localStorage.setItem('currentUser', username);

// }

// update user with token
function updateToken(username, token) {
    console.log("updateToken")
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    // Update the user's entry with the token
    existingUsers[username].token = token;

    localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser', username);
}


// function getExistingUser(username) {
//     const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

//     // console.log(existingUsers);

//     return existingUsers[username];
// }