const newUsername = localStorage.getItem('newUsername');
let finalPassword;
let firstPassword;

let bioTextArea = document.getElementById('bio-field');
let charCount = document.getElementById('character-counter')

const spanUsername = document.getElementById('newUserPlaceholder');
spanUsername.textContent = newUsername;

// for character counting of bio
bioTextArea.addEventListener("input", () => {
    const maxLength = 50;
    const currentLength = bioTextArea.value.length;
    charCount.textContent = currentLength;

    // Check if the current length exceeds the maximum length
    if (currentLength > maxLength) {
        alert("Bio length should not exceed 50 characters.");
        // Truncate the text to the maximum length
        bioTextArea.value = bioTextArea.value.substring(0, maxLength);
        // Update the character count display
        charCount.textContent = maxLength;
    }
});





document.getElementById('nextButton_2').addEventListener('click', function(event) {
    event.preventDefault();

    // Get bio
    const bio = document.querySelector('.register2--input-field-bio').value;

    // Get passwords
    firstPassword = document.querySelector('#userPassword1').value;
    finalPassword = document.querySelector('#userPassword2').value;

    // Check if passwords match
    if (firstPassword !== finalPassword) {
        alert("Passwords don't match!");
        return;
    }

    // Save bio and register user
    localStorage.setItem('newBio', bio);    
    localStorage.setItem('newPass', finalPassword);   

    // Register user
    registerNewUser();

    saveBio(newUsername, bio);
});



// register backend
function registerNewUser() {

    // body for header
    var raw = JSON.stringify({
        "username": newUsername,
        "password": finalPassword
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
        .then(result => {
            console.log(result);
            // After successful registration, save user
            saveUser(newUsername, finalPassword);

            // Proceed with other actions

            

            window.location.href = 'index.html';
        })
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


// save user
function saveUser(username, password) {
    console.log("saveuser")
    
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    existingUsers[username] = { password: password};

    localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
    

}



