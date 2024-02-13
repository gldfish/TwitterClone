


import { getExistingUser } from './common_exports.js';


let token = getExistingUser(localStorage.getItem('currentUser'))['token'];

console.log(localStorage.getItem('viewProfile'));

const viewUserJSON = localStorage.getItem('viewProfile');
const viewUser = JSON.parse(viewUserJSON);

const user = viewUser['viewProfile'];
const bio = viewUser['bio'];  

// username
const profileName = document.querySelector('.profile-name');
profileName.textContent = user;

const profileNameSide = document.querySelector('.mobile--profile-name');
profileNameSide.textContent = user;

const profileNameMobile = document.querySelector('.mobile-profile-name');
profileNameMobile.textContent = user;


// handle
const handleName = document.querySelector('.profile-handler');
handleName.textContent = `@${user}`;

const handleNameMobile = document.querySelector('.mobile-profile-handler');
handleNameMobile.textContent = `@${user}`;

const handleNameSide = document.querySelector('.mobile--profile-handler');
handleNameSide.textContent = `@${user}`;


// bio
const bioUser = document.querySelector('.profile-bio');
bioUser.textContent = bio;

const bioUserMobile = document.querySelector('.mobile-profile-bio');
bioUserMobile.textContent = bio;

const bioUserSide = document.querySelector('.mobile--profile-bio');
bioUserSide.textContent = bio;


// header
const header = document.querySelector('.post-header');
header.textContent = `${user}'s Posts`







function getFollowing(currUser) {
    var requestOptions = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };

    return fetch(`http://localhost:3000/api/v1/users/${currUser}/following`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(result => {
            console.log(result)
            return JSON.parse(result);
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}



const followingElement = document.querySelector('strong[style="font-size: 14px; font-weight: bold;"]');
const followingElementMobile = document.querySelector('.mobile-profile-view strong');

getFollowing(user)
    .then(result => {
        followingElementMobile.textContent = result.length;
        followingElement.textContent = result.length;
    })
    .catch(error => {
        
        console.error('Error:', error);
    });



// get post backend 
// function getPost() {

//     var fetchRequest = {
//         method: 'GET',
//         headers: {
//             Authorization: token
//         },
//         redirect: 'follow'
//     };

//     // fetch
//     fetch("http://localhost:3000/api/v1/posts?user=olivia", fetchRequest)
//     .then(response => response.text())
//     .then(result => console.log("res", result))
//     .catch(error => console.log('error', error));
// }



// getPost();

// console.log("loaded")