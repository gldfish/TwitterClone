import { updateProfile, getExistingUser } from './common_exports.js';


// profile for desktop
updateProfile('.profile-name', '.profile-handler', '.profile-bio');

// profile for mobile
updateProfile('.mobile--profile-name', '.mobile--profile-handler', '.mobile--profile-bio');


let userPostContent;
let token = getExistingUser(localStorage.getItem('currentUser'))['token'];

console.log(token, "TOKENTOKEN")

// posting back end
// submit post DESKTOP BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector(".post-button");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
            //console.log("yoo");
            //console.log(document.getElementById("postTextarea").value);
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
            //console.log("yoo");
            //console.log(document.getElementById("postTextarea").value);
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

    console.log('completed')
}


// main feed container
let feedPostSection = document.querySelector('.feed--post-section');

// create post
function createPost(postsList) {
    resetPost()
    

    for (let i = postsList.length - 1; i >= 0; i--) {
        console.log(postsList[i])

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




        interactionPost.appendChild(likeDisplay);
        interactionPost.appendChild(likeButton);


        addedPost.appendChild(userInfoPost)
        addedPost.appendChild(contentText)
        addedPost.appendChild(interactionPost)

        feedPostSection.appendChild(addedPost);

    }
    
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
        
        console.log("result", result);

        createPost(result);

    })
    .catch(error => console.log('error', error));
}

// on page load
document.addEventListener("DOMContentLoaded", getPost);
