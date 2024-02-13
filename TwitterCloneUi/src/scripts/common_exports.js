// profile update 
export function updateProfile(usernameSelector, handleSelector, bioSelector) {
    const userNameElem = document.querySelector(usernameSelector);
    const userhandleElem = document.querySelector(handleSelector);
    const userBioElem = document.querySelector(bioSelector);

    const currentUser = localStorage.getItem('currentUser');
    userNameElem.textContent = currentUser;
    userhandleElem.textContent = `@${currentUser}`;
    userBioElem.textContent = retrieveBio(currentUser);
}

// retrive bio
function retrieveBio(username) {
    const userBio = JSON.parse(localStorage.getItem('userBio')) || {};

    return userBio[username] ? userBio[username].bio : null;
}

// get user information data
export function getExistingUser(username) {
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    //console.log(existingUsers, "USERS");

    return existingUsers[username];
}

// sort posts
export function sortPostsByDateTime(posts) {
    return posts.sort((a, b) => {
      return new Date(a.dateTimePosted) - new Date(b.dateTimePosted);
    });
}