


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



function getIsCurrFollowing() {

}



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
    console.log("getfollowog", result)
    followingElementMobile.textContent = result.length;
    followingElement.textContent = result.length;
})
.catch(error => {
    
    console.error('Error:', error);
});



// main feed container
let profilePostSection = document.querySelector('.profile--post-section');



// create post
function createPost(postsList) {
    //console.log(postsList)

    for (let i = postsList.length - 1; i >= 0; i--) {
    
        const post = postsList[i];


        
        // Create post content
        const postContent = document.createElement('div');
        postContent.classList.add('profile--post-content');

        // Create user info
        const postUser = document.createElement('div');
        postUser.classList.add('profile--post-user');

        const userImage = document.createElement('img');
        userImage.setAttribute('src', 'image/2.png');

        const userInfo = document.createElement('div');
        userInfo.classList.add('profile--post-info');

        const userInfoContainer = document.createElement('div');
        userInfoContainer.classList.add('profile--user-info');

        const userName = document.createElement('p');
        userName.classList.add('profile--username');
        userName.textContent = post['postedBy'];

        const userHandle = document.createElement('p');
        userHandle.classList.add('profile--userhandle');
        userHandle.textContent = `@${post['postedBy']}`;

        userInfoContainer.appendChild(userName);
        userInfoContainer.appendChild(userHandle);
        userInfo.appendChild(userInfoContainer);

        // const postTime = document.createElement('p');
        // postTime.classList.add('profile--time');
        // postTime.textContent = post.postTime;

        // userInfo.appendChild(postTime);
        postUser.appendChild(userImage);
        postUser.appendChild(userInfo);

        // Create post text
        const postText = document.createElement('div');
        postText.classList.add('profile--post-text');
        postText.textContent = post['content'];

        // Create post interaction
        const postInteraction = document.createElement('div');
        postInteraction.classList.add('profile--post-interaction');

        const likeDisplay = document.createElement('div');
        likeDisplay.classList.add('profile--like-display');

        const likeImage = document.createElement('img');
        likeImage.setAttribute('src', 'image/like.png');

        const likeCount = document.createElement('p');
        likeCount.textContent = `${postsList[i]['likes'].length} Likes`;

        likeDisplay.appendChild(likeImage);
        likeDisplay.appendChild(likeCount);

        const likeButton = document.createElement('button');
        likeButton.classList.add('likePostBtn');
        likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>Like';

        postInteraction.appendChild(likeDisplay);
        postInteraction.appendChild(likeButton);

        // Append all elements to postContent
        postContent.appendChild(postUser);
        postContent.appendChild(postText);
        postContent.appendChild(postInteraction);

        // Append postContent to profilePostSection
        profilePostSection.appendChild(postContent);
    
    }


}


// reset post
function resetPost() {
    const postsContainer = document.querySelector('.profile--post-section');

    while (postsContainer.firstChild) {
        postsContainer.removeChild(postsContainer.firstChild);
    }
}




// get post backend 
function getSpecificPost() {
    console.log(user)

    var fetchRequest = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };




    // `http://localhost:3000/api/v1/posts?username=${user}`
    // fetch
    fetch(`http://localhost:3000/api/v1/posts?username=${user}`, fetchRequest)
    .then(response => response.json())
    .then(result => {
        
        console.log("result", result);

        console.log()

        createPost(result);

    })
    .catch(error => console.log('error', error));
};

// on page load
document.addEventListener("DOMContentLoaded", getSpecificPost);