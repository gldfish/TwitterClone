import { updateProfile, getExistingUser, sortPostsByDateTime } from './common_exports.js';


// profile for desktop
updateProfile('.profile-name', '.profile-handler', '.profile-bio');

// profile for mobile
updateProfile('.mobile--profile-name', '.mobile--profile-handler', '.mobile--profile-bio');


let userPostContent;
let token = getExistingUser(localStorage.getItem('currentUser'))['token'];
let currFollowing;





// posting back end
// submit post DESKTOP BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector(".post-button");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
           
            userPostContent = document.getElementById("postText").value;

            // VALIDATION 250 WORDS AND EMPTY TEXTAREA

            posting();
            getPost();
        });
    }
});


// submit post DESKTOP BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector("#mobile--post");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
            
            userPostContent = document.getElementById("postTextMobile").value;

            // VALIDATION 250 WORDS AND EMPTY TEXTAREA

            posting();
            getPost();
        });
    }
});




// post back end
function posting() {
     // body for header
     var raw = JSON.stringify({
        "content": userPostContent
    });

    var fetchRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        },
        body: raw,
        redirect: 'follow'
    };

    // fetch
    fetch("http://localhost:3000/api/v1/posts", fetchRequest)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


// main feed container
let feedPostSection = document.querySelector('.feed--post-section');

// create post
function createPost(postsList) {
    resetPost()
    

    for (let i = postsList.length - 1; i >= 0; i--) {
        
        // create post container
        const addedPost = document.createElement('div');
        addedPost.setAttribute('class', 'feed--post-content');

        // USERINFO
        const userInfoPost = document.createElement('div');
        userInfoPost.setAttribute('class', 'feed--post-user')

        const userImage = document.createElement('img');
        userImage.setAttribute('src', 'image/2.png');

        const userInfo = document.createElement('div');
        userInfo.setAttribute('class', 'feed--post-info');


        const userFullName = document.createElement('p');
        userFullName.setAttribute('class', 'feed--username');
        userFullName.textContent = postsList[i]['postedBy'];

        const userHandle = document.createElement('p');
        userHandle.setAttribute('class', 'feed--userhandle');
        userHandle.textContent = `@${postsList[i]['postedBy']}`;

        const userFullNameHandle = document.createElement('div');
        userFullNameHandle.setAttribute('class', 'feed--user-info');
        userFullNameHandle.appendChild(userFullName);
        userFullNameHandle.appendChild(userHandle);

        // const postTime = document.createElement('p');
        // postTime.setAttribute('class', 'feed--time');
        // postTime.textContent = '45 mins ago.';

        userInfo.appendChild(userFullNameHandle);
        //userInfo.appendChild(postTime);

        userInfoPost.appendChild(userImage);
        userInfoPost.appendChild(userInfo);


        // CONTENT
        const contentText = document.createElement('div');
        contentText.setAttribute('class', 'feed--post-text');
        contentText.textContent = postsList[i]['content'];

        
        // INTERACTION
        const interactionPost = document.createElement('div');
        interactionPost.setAttribute('class', 'feed--post-interaction')

        // interaction container
        const likeDisplay = document.createElement('div');
        likeDisplay.setAttribute('class', 'feed--like-display');

        // like image
        const likeImage = document.createElement('img');
        likeImage.setAttribute('src', 'image/like.png');

        // like count
        const likeCount = document.createElement('p');
        likeCount.textContent = `${postsList[i]['likes'].length} Likes`;

        likeDisplay.appendChild(likeImage);
        likeDisplay.appendChild(likeCount);

        // like button
        const likeButton = document.createElement('button');
        likeButton.setAttribute('class', 'likePostBtn');
        likeButton.innerHTML = '<i class="fa-regular fa-heart"></i>Like';
        
        likeButton.addEventListener('click', likePost)
        likeButton.setAttribute('id', postsList[i]['postId']);
        // console.log(postsList[i])


        interactionPost.appendChild(likeDisplay);
        interactionPost.appendChild(likeButton);


        addedPost.appendChild(userInfoPost)
        addedPost.appendChild(contentText)
        addedPost.appendChild(interactionPost)

        feedPostSection.appendChild(addedPost);

    }
    
}

// gawa ni jett
function likePost() {
    console.log("liek")
    console.log(this.id)
}


// reset post
function resetPost() {
    const postsContainer = document.querySelector('.feed--post-section');

    while (postsContainer.firstChild) {
        postsContainer.removeChild(postsContainer.firstChild);
    }
}


// get post backend 
function getPost() {
    

    var fetchRequest = {
        method: 'GET',
        headers: {
            Authorization: token
        },
        redirect: 'follow'
    };

    // fetch
    fetch("http://localhost:3000/api/v1/posts", fetchRequest)
    .then(response => response.json())
    .then(result => {
        
        createPost(sortPostsByDateTime(result));

    })
    .catch(error => console.log('error', error));
}

// on page load
document.addEventListener("DOMContentLoaded", getPost);





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
        
        //console.log("USERS", result);

        createProfileSide(result, currFollowing)

    })
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
        .then(response => response.text())
        .then(result => {
            //console.log("FOLLOWINGG", result);
            return JSON.parse(result);
        })
        .catch(error => {
            console.log('error', error);
            throw error; 
        });
}


document.addEventListener("DOMContentLoaded", function() {
    getFollowing(localStorage.getItem('currentUser'))
        .then(currFollowing => {
            getUsers(currFollowing)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


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
    console.log(this.id)
    //console.log(localStorage.getItem('userBio'))

    const userBioJSON = localStorage.getItem('userBio');
    const userBioObject = JSON.parse(userBioJSON);
    const userBio = userBioObject[this.id].bio;
    console.log(userBio);

    const viewProfile = {
        "bio": userBio,
        "viewProfile": this.id
    }

    localStorage.setItem('viewProfile', JSON.stringify(viewProfile));
}



function clickFollowHandler() {
    const userToFollow = this.id;
    const currUser = localStorage.getItem('currentUser');
    follow(currUser, userToFollow);

    this.textContent = 'Unfollow';

    this.removeEventListener('click', clickFollowHandler);
    this.addEventListener('click', clickUnfollowHandler)

    getPost();
}


// sample unfollow func
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

setInterval(getPost, 1000);