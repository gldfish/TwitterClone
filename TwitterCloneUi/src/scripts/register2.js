

const newUsername = localStorage.getItem('newUsername');
let password;

const spanUsername = document.getElementById('newUserPlaceholder');
spanUsername.textContent = newUsername;


document.getElementById('nextButton_2').addEventListener('click', function(event) {
    event.preventDefault();

    // ADD VALIDATION FOR PASSWORD



    
    const bio =  document.querySelector('.register2--input-field-bio').value;
    password = document.querySelector('#userPassword1').value;

    localStorage.setItem('newBio', bio);    
    localStorage.setItem('newPass', password);   



    // resister user
    registerNewUser();
    saveBio(newUsername, bio)

    window.location.href = 'index.html';

});


// register backend
function registerNewUser() {

    // body for header
    var raw = JSON.stringify({
        "username": newUsername,
        "password": password
    });

    var fetchRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: raw,
        redirect: 'follow',
    };

    // fetch
    fetch("http://localhost:3000/api/v1/auth/register", fetchRequest)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error)
    );
    
}


// save bio
function saveBio(username, bio) {
    console.log("savebio")
    const userBio = JSON.parse(localStorage.getItem('userBio')) || {};

    userBio[username] = { bio: bio };

    localStorage.setItem('userBio', JSON.stringify(userBio));
}


