import { updateProfile, getExistingUser } from './common_exports.js';

// profile for desktop
updateProfile('.profile-name', '.profile-handler', '.profile-bio');


// profile for mobile
updateProfile('.mobile--profile-name', '.mobile--profile-handler', '.mobile--profile-bio');


let token = getExistingUser(localStorage.getItem('currentUser'))['token'];


document.addEventListener("DOMContentLoaded", function() {
    getFollowing(localStorage.getItem('currentUser'))
        .then(currFollowing => {
            getUsers(currFollowing)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function getFollowing(currUser) {
    var requestOptions = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };

    
    return fetch(`http://localhost:3000/api/v1/users/${currUser}/following`, requestOptions)
        .then(response => response.text())
        .then(result => {
    
            return JSON.parse(result);
        })
        .catch(error => {
            console.log('error', error);
            throw error; 
        });
}



// get users
function getUsers(currFollowing) {
    var fetchRequest = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };

    // fetch
    fetch("http://localhost:3000/api/v1/users/", fetchRequest)
    .then(response => response.json())
    .then(result => {

        createProfileSide(result, currFollowing)

    })
    .catch(error => console.log('error', error));
}


// people you may know section
const followContainer = document.querySelector(".follow-container");
function createProfileSide(usersList, currFollowing) {
    

    for (let i = usersList.length - 1; i >= 0; i--) {

        if (usersList[i] === localStorage.getItem('currentUser')) {
            continue;
        }

        const addedPost = document.createElement('div');
        addedPost.setAttribute('class', 'follow-profile');
            
        const img = document.createElement('img');
        img.setAttribute('src', 'image/2.png');
        addedPost.appendChild(img);

        const followUser = document.createElement('a');
        followUser.setAttribute('class', 'follow-user');
        followUser.setAttribute('id', usersList[i]);
        followUser.setAttribute('href', 'viewProfile.html');
        followUser.addEventListener('click', viewUserProfile)

        const nameParagraph = document.createElement('p');
        nameParagraph.textContent = usersList[i];
        followUser.appendChild(nameParagraph);

        const handleParagraph = document.createElement('p');
        handleParagraph.textContent = `@${usersList[i]}`;
        followUser.appendChild(handleParagraph);

        addedPost.appendChild(followUser);

        const followButton = document.createElement('button');
        followButton.setAttribute('class', 'profileFollowBtn');
        followButton.setAttribute('id', usersList[i]);

        if (currFollowing.includes(usersList[i])) {
            followButton.textContent = 'Unfollow';
            followButton.addEventListener('click', clickUnfollowHandler);
        } else {
            followButton.textContent = 'Follow';
            followButton.addEventListener('click', clickFollowHandler);
        }
        
        addedPost.appendChild(followButton);
        followContainer.appendChild(addedPost);
    }
}   


// view profile 
function viewUserProfile() {

    const userBioJSON = localStorage.getItem('userBio');
    const userBioObject = JSON.parse(userBioJSON);
    const userBio = userBioObject[this.id].bio;
    

    const viewProfile = {
        "bio": userBio,
        "viewProfile": this.id
    }

    localStorage.setItem('viewProfile', JSON.stringify(viewProfile));
}


// follow function
function clickFollowHandler() {
    const userToFollow = this.id;
    const currUser = localStorage.getItem('currentUser');
    follow(currUser, userToFollow);

    this.textContent = 'Unfollow';

    this.removeEventListener('click', clickFollowHandler);
    this.addEventListener('click', clickUnfollowHandler)

    getPost();
}


// unfollow function
function clickUnfollowHandler() {
    const userToUnfollow = this.id;
    const currUser = localStorage.getItem('currentUser');
    unfollow(currUser, userToUnfollow);

    this.textContent = 'Follow';

    this.removeEventListener('click', clickUnfollowHandler);
    this.addEventListener('click', clickFollowHandler)

    getPost();
}



// follow backend
function follow(currUser, userToFollow) {
    var requestOptions = {
        method: 'POST',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };


    fetch(`http://localhost:3000/api/v1/users/${currUser}/following/${userToFollow}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


// unfollow backend
function unfollow(currUser, userToUnfollow) {
    var requestOptions = {
        method: 'DELETE',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/api/v1/users/${currUser}/following/${userToUnfollow}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}
