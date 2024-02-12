// Side Bar
function toggleSideBar() {
    var sidebar = document.getElementsByClassName("sidebar")[0];
    var icon = document.getElementById("sidebarIcon");
    var brandName = document.getElementById("brandname");

    if (sidebar.style.width === "275px") {
        
        sidebar.style.width = "0";
        
        icon.className = "fa-solid fa-bars";
        
        
        brandName.style.display = "block"; 
    } else {
        
        sidebar.style.width = "275px";
        
        icon.className = "fa-solid fa-xmark";
        icon.style.fontSize = "25px";
        
        brandName.style.display = "none";
    }
}



// Toggle Discover Section (For Mobile)
function toggleDiscoverSection(right, middle) {

    var discoverSections = document.getElementsByClassName(right);
    var feedSections = document.getElementsByClassName(middle);

    

    for (var i = 0; i < discoverSections.length; i++) {
        discoverSections[i].style.gridColumn = "1";
        var style = window.getComputedStyle(discoverSections[i]);
        console.log(style.display)
        if (style.display === "none") {
            discoverSections[i].style.display = "block";

        } else {
            discoverSections[i].style.display = "none";
        }
    }

    for (var i = 0; i < feedSections.length; i++) {
        var style = window.getComputedStyle(feedSections[i]);
        if (style.display === "none") {
            feedSections[i].style.display = "block";

        } else {
            feedSections[i].style.display = "none";
        }
    }
}


function adjustGridColumn(right, middle) {
    var screenWidth = window.innerWidth; 
    var discoverSections = document.getElementsByClassName(right);
    var feedSections = document.getElementsByClassName(middle);

    if (screenWidth > 600) {
        for (var i = 0; i < discoverSections.length; i++) {
            discoverSections[i].style.gridColumn = "3";
            discoverSections[i].style.display = "block";
        }

        for (var i = 0; i < feedSections.length; i++) {
            feedSections[i].style.display = "block";
        }
    } 
    else {
        for (var i = 0; i < feedSections.length; i++) {
            feedSections[i].style.display = "block";
        }

        for (var i = 0; i < discoverSections.length; i++) {
            discoverSections[i].style.gridColumn = "1";
            discoverSections[i].style.display = "none";
        }


    }
}


window.addEventListener("resize", function() {
    adjustGridColumn("feed-right-container", "feed-middle-container");
});

window.addEventListener("resize", function() {
    adjustGridColumn("news--right-container", "news--middle-container");
});



