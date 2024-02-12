import { currUsernameRegistered } from "./data.js";



document.getElementById('nextButton').addEventListener('click', function() {
    const newUsername = document.querySelector('.register--input-field').value;

    if (currUsernameRegistered.includes(newUsername)) {
        alert('Username is already registered. Please choose a different one.');
    } else {
       
        localStorage.setItem('newUsername', newUsername);
        
        window.location.href = 'register2.html';
    }
    console.log(newUsername)
    console.log(currUsernameRegistered)
});



