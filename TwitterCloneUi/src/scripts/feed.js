import { updateProfile, getExistingUser, sortPostsByDateTime } from './common_exports.js';


// profile for desktop
updateProfile('.profile-name', '.profile-handler', '.profile-bio');

// profile for mobile
updateProfile('.mobile--profile-name', '.mobile--profile-handler', '.mobile--profile-bio');


let userPostContent;
let token = getExistingUser(localStorage.getItem('currentUser'))['token'];
const tokenWithoutBearer = token.replace("Bearer ", "");

console.log(tokenWithoutBearer)

let postTextArea = document.getElementById('postText');
let mobileTextArea = document.getElementById('postTextMobile');
let charCount = document.getElementById('char-count');
let mobileCount = document.getElementById('mobile-char-count');



// post length validation (DESKTOP)
postTextArea.addEventListener("input", () => {
    const maxLength = 280;
    const currentLength = postTextArea.value.length;
    charCount.textContent = currentLength;

    
    if (currentLength > maxLength) {
        alert("Post length should not exceed 280 characters.");
        postTextArea.value = postTextArea.value.substring(0, maxLength);
        charCount.textContent = maxLength;
    }
});



// post length validation (MOBILE)
mobileTextArea.addEventListener("input", () => {
    const maxLength = 280;
    const currentLength = mobileTextArea.value.length;
    mobileCount.textContent = currentLength;

    
    if (currentLength > maxLength) {
        alert("Post length should not exceed 280 characters.");
        mobileTextArea.value = mobileTextArea.value.substring(0, maxLength);
        mobileCount.textContent = maxLength;
    }
});



// submit post DESKTOP BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector(".post-button");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
            userPostContent = document.getElementById("postText").value;


            posting();
            getPost();
        });
    }
});



// submit post MOBILE BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector("#mobile--post");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
            
            userPostContent = document.getElementById("postTextMobile").value;

            posting();
            getPost();
        });
    }
});



// posting back end
function posting() {
     // body for header
     var raw = JSON.stringify({
        "content": userPostContent
    });

    var fetchRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        body: raw,
        redirect: 'follow'
    };

    // fetch
    fetch(`/api/v1/posts`, fetchRequest)
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

        
        userInfo.appendChild(userFullNameHandle);
        

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
        
        interactionPost.appendChild(likeDisplay);
        interactionPost.appendChild(likeButton);

        addedPost.appendChild(userInfoPost)
        addedPost.appendChild(contentText)
        addedPost.appendChild(interactionPost)

        feedPostSection.appendChild(addedPost);

    }
}



// LIKE FUNCTION
const likePost = function(event){
    const parentDiv = event.target.parentNode;
    const postID = this.id;

    const likeCountElement = parentDiv.querySelector('.likeCount');

    let newLikeCount = parseInt(likeCountElement.textContent);
    newLikeCount++;

    //likeCountElement.textContent = newLikeCount;

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
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        body: raw,
        redirect: 'follow'
    };
  
    fetch(`/api/v1/posts/${postID}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    likeBtn.addEventListener('click', unlikePost)
    getPost();
}



//UNLIKE FUNCTION
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
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        body: raw,
        redirect: 'follow'
    };

    fetch(`/api/v1/posts/${postID}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    likeBtn.addEventListener('click', likePost)
    getPost();
}


// reset post
function resetPost() {
    const postsContainer = document.querySelector('.feed--post-section');

    while (postsContainer.firstChild) {
        postsContainer.removeChild(postsContainer.firstChild);
    }
}


// get post backend 
async function getPost() {
    var fetchRequest = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`/api/v1/posts`, fetchRequest);
        const result = await response.json();
        console.log(token);
        console.log(response)
        console.log(result)
        await createPost(sortPostsByDateTime(result));
    } catch (error) {
        console.log('error', error);
    }
}



// on page load
document.addEventListener("DOMContentLoaded", getPost);



// get users
function getUsers(currFollowing) {
    var fetchRequest = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        redirect: 'follow'
    };

    // fetch
    fetch(`/api/v1/users/`, fetchRequest)
    .then(response => response.json())
    .then(result => {
        

        createProfileSide(result, currFollowing)

    })
    .catch(error => console.log('error', error));
}



async function getFollowing(currUser) {
    var requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        redirect: 'follow'
    };

    try {
        const response = await fetch(`/api/v1/users/${currUser}/following`, requestOptions);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.text();
        console.log(JSON.parse(result));
        return JSON.parse(result);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const currFollowing = await getFollowing(localStorage.getItem('currentUser'));
        await getUsers(currFollowing);
    } catch (error) {
        console.error('Error:', error);
    }
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

    const userBioJSON = localStorage.getItem('userBio');
    const userBioObject = JSON.parse(userBioJSON);
    const userBio = userBioObject[this.id].bio;
    

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



// unfollow func
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
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        redirect: 'follow'
    };


    fetch(`/api/v1/users/${currUser}/following/${userToFollow}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}



// unfollow backend
function unfollow(currUser, userToUnfollow) {
    var requestOptions = {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${tokenWithoutBearer}`
        },
        redirect: 'follow'
    };
    

    fetch(`/api/v1/users/${currUser}/following/${userToUnfollow}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}



//interval for refresh
//setInterval(getPost, 1000);