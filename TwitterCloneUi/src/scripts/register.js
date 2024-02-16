

document.getElementById('nextButton').addEventListener('click', function() {
    // Get the entered username
    const newUsername = document.querySelector('.register--input-field').value;
    
    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    // check if username input is blank
    if (!newUsername.trim()){
        alert("Username can't be blank!");
        return;
    }


    // Check if the username already exists
    if (existingUsers.hasOwnProperty(newUsername)) {
        alert('Username is already registered. Please choose a different one.');
    } else {
        // Username is not registered, proceed with registration
        localStorage.setItem('newUsername', newUsername);
        window.location.href = 'register2.html';
    }

    


});



