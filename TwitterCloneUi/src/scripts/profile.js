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


// post validation (Character Count)

let charCount = document.getElementById('char-count');
let postTextArea = document.getElementById('postTextarea');

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




// create post
function createPost(postsList) {
    resetPost(profilePostSection);
    
    for (let i = postsList.length - 1; i >= 0; i--) {
        const post = postsList[i];

        if (localStorage.getItem('currentUser') !== post['postedBy']) {
            continue;
        }
        
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
        

        createPost(result);

    })
    .catch(error => console.log('error', error));
}

// on page load
document.addEventListener("DOMContentLoaded", getPost);



// get following
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
            
            return JSON.parse(result);
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

const followingElementMobile = document.querySelector('.mobile-profile-view strong');
const followingElement = document.querySelector('.profile-section strong');


getFollowing(localStorage.getItem('currentUser'))
    .then(result => {
        followingElement.textContent = result.length;
        followingElementMobile.textContent = result.length;
    })
    .catch(error => {
        
        console.error('Error:', error);
    });

//interval for refresh
setInterval(getPost, 1000)
