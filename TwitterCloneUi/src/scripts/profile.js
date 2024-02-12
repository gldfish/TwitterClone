import { updateProfile, getExistingUser } from './common_exports.js';



// profile for desktop
updateProfile('.profile-name', '.profile-handler', '.profile-bio');


// profile for mobile side bar
updateProfile('.mobile--profile-name', '.mobile--profile-handler', '.mobile--profile-bio');


// profile for mobile main view
updateProfile('.mobile-profile-name', '.mobile-profile-handler', '.mobile-profile-bio');


let token = getExistingUser(localStorage.getItem('currentUser'))['token'];



// main feed container
let profilePostSection = document.querySelector('.profile--post-section');

// create post
function createPost(postsList) {
    resetPost(profilePostSection);
    
    for (let i = postsList.length - 1; i >= 0; i--) {
        const post = postsList[i];
        console.log(post)
        
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


let userPostContent;



// submit post DESKTOP BUTTON
document.addEventListener("DOMContentLoaded", function() {
    var postButton = document.querySelector("#postForm");
    if (postButton) {
        postButton.addEventListener("click", function(event) {
            event.preventDefault();
            
            //console.log(document.getElementById("postTextarea").value);
            userPostContent = document.getElementById("postTextarea").value;

            console.log(userPostContent)

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

        console.log()

        createPost(result);

    })
    .catch(error => console.log('error', error));
}

// on page load
document.addEventListener("DOMContentLoaded", getPost);
