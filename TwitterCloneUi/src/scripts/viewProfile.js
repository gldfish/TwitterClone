import { getExistingUser } from './common_exports.js';


let token = getExistingUser(localStorage.getItem('currentUser'))['token'];

console.log(localStorage.getItem('viewProfile'));

const viewUserJSON = localStorage.getItem('viewProfile');
const viewUser = JSON.parse(viewUserJSON);

const user = viewUser['viewProfile'];
const bio = viewUser['bio'];  

const currUserViewer = localStorage.getItem('currentUser');

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

// follow button
var followButton = document.querySelector('button');


function getIsCurrFollowing(userFollowing) {
    if (userFollowing.includes(user)) {
        
        followButton.textContent = "Unfollow";
        followButton.addEventListener('click', clickUnfollowHandler)

    } else {
        
        followButton.textContent = "Follow";
        followButton.addEventListener('click', clickFollowHandler)
    }

}

// follow function
function clickFollowHandler() {
    
    follow(currUserViewer, user);

    

    this.textContent = 'Unfollow';

    this.removeEventListener('click', clickFollowHandler);
    this.addEventListener('click', clickUnfollowHandler)

}

// unfollow function
function clickUnfollowHandler() {
 
    unfollow(currUserViewer, user);

    

    this.textContent = 'Follow';

    this.removeEventListener('click', clickUnfollowHandler);
    this.addEventListener('click', clickFollowHandler)

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


getFollowing(currUserViewer)
.then(result => {
    getIsCurrFollowing(result);
})
.catch(error => {
    
    console.error('Error:', error);
});



// main feed container
let profilePostSection = document.querySelector('.profile--post-section');



// create post
function createPost(postsList) {
    //console.log(postsList)
    resetPost();

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
        likeCount.setAttribute('class', 'likeCount')

        likeDisplay.appendChild(likeImage);
        likeDisplay.appendChild(likeCount);



        // like button
        const likeButton = document.createElement('button');
        likeButton.setAttribute('class', 'likePostBtn');

        if (postsList[i]['likes'].includes(localStorage.getItem('currentUser'))) {
            likeButton.innerHTML = '<i class="fa-solid fa-heart-crack"></i>Unlike';
            likeButton.addEventListener('click', unlikePost)

        }
        else {
            likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>Like';
            likeButton.addEventListener('click', likePost)
        }

        
        likeButton.setAttribute('id', postsList[i]['postId']);
        

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

//LIKE FUNCTIONALITY
const likePost = function(event){
    const parentDiv = event.target.parentNode;
    
    const postID = this.id;

    const likeCountElement = parentDiv.querySelector('.likeCount');

    let newLikeCount = parseInt(likeCountElement.textContent);
    newLikeCount++;

    

    const likeBtn = parentDiv.querySelector('.likePostBtn');
    likeBtn.innerHTML = '<i class="fa-solid fa-heart-crack"></i>Unlike'
    likeBtn.removeEventListener('click', likePost)

    var raw = JSON.stringify({
        "action": "like"
    });

    var requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://localhost:3000/api/v1/posts/${postID}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    likeBtn.addEventListener('click', unlikePost)
}

const unlikePost = function(event) {
    
    const parentDiv = event.target.parentNode;
    
    const postID = this.id;

    const likeCountElement = parentDiv.querySelector('.likeCount');

    let newLikeCount = parseInt(likeCountElement.textContent);
    newLikeCount--;

    

    const likeBtn = parentDiv.querySelector('.likePostBtn');
    likeBtn.innerHTML = '<i class="fa-solid fa-heart-crack"></i>Unlike'

    likeBtn.removeEventListener('click', unlikePost)

    var raw = JSON.stringify({
        "action": "unlike"
    });

    var requestOptions = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://localhost:3000/api/v1/posts/${postID}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    likeBtn.addEventListener('click', likePost)
}






// get post backend 
function getSpecificPost() {
    
    var fetchRequest = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };


    // fetch
    fetch(`http://localhost:3000/api/v1/posts?username=${user}`, fetchRequest)
    .then(response => response.json())
    .then(result => {

        createPost(result);

    })
    .catch(error => console.log('error', error));
};

// on page load
document.addEventListener("DOMContentLoaded", getSpecificPost);




// reset post
function resetPost() {
    const profilePostSection = document.querySelector('.profile--post-section');

    while (profilePostSection.firstChild) {
        profilePostSection.removeChild(profilePostSection.firstChild);
    }
}

// refresh interval
setInterval(getSpecificPost, 1000)
