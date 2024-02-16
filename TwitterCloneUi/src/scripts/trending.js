
const url = "https://api.twitter.com/1.1/trends/place.json";


const locationId = 1;

// Authentication credentials
const apiKey = "fEE5V4FZ9htVJrocMsEtrPZOq";
const apiSecretKey = "2Xq3eZjn1fslBMzHrqEGDnUFVf47U7cjJRoC07NK904tQvp18m";
const accessToken = "1753988521663315968-nsZ7KuFDL8ZrsnoullCsAf9oiclR0k";
const accessTokenSecret = "WGegyFGIKjZjklyUr2XVMBE9XxmXOHAtvJDnSkx53xFfl";

// Parameters for the request
const params = {
    id: locationId
};


const authorizationHeader = "Bearer " + btoa(apiKey + ":" + apiSecretKey);

// request
fetch(url + "?id=" + locationId, {
    method: "GET",
    headers: {
        Authorization: authorizationHeader
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error("Error fetching trends:", error);
});
