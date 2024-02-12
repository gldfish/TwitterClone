import { newsColl, setNewsColl } from './data.js';

const newsContainer = document.querySelector('.news--post-container');

const apikey = 'ac90ce7cdeb7254fa73787dfd0fc2d0b';
const category = 'general';
const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=10&apikey=' + apikey;

async function fetchData(callback) {
    try {
        const response = await fetch('https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=ac90ce7cdeb7254fa73787dfd0fc2d0b');
        const data = await response.json();
        callback(data.articles);
    } catch (error) {
        console.error('Error fetching news data:', error);
        callback(null);
    }
}

function NewsPage(callback) {
    fetchData(callback);
}

NewsPage(newsData => {
    setNewsColl(newsData);
    DisplayNews(newsColl);
});

function DisplayNews(newsColl) {
    

    for (var news of newsColl) {

        // if (news['description'].length > 125 || news['description'].length <= 10 || news['author'] == null || news['author'].length > 15) {
        //     continue;
        // } 

        // console.log(news)

        // container
        const newNewsPostCont = document.createElement('div');
        newNewsPostCont.setAttribute('class', 'news--item');

        

        // text main infotmation
        const newTextContainer = document.createElement('div');
        newTextContainer.setAttribute('class', 'news--text-container');


        // text first main information
        const textinfo_1 = document.createElement('div');
        textinfo_1.setAttribute('class', 'text-information');
        
        // date 
        const dateInfo = document.createElement('div');
        dateInfo.setAttribute('class', 'content-date');

        const date = new Date(news['publishedAt']);
        const options = { year: 'numeric', month: 'long', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        const dateTxt = document.createTextNode(`Published At: ${formattedDate}`);
        dateInfo.appendChild(dateTxt);
        textinfo_1.appendChild(dateInfo);


        // source
        // const sourceInfo = document.createElement('div');
        // sourceInfo.setAttribute('class', 'content-source')

        
        // const sourceTxt = document.createTextNode(`Source: ${news['source']['name']}`);
        // sourceInfo.appendChild(sourceTxt);


        // textinfo_1.appendChild(sourceInfo);



        // text content container
        const newTextContent = document.createElement('div');
        newTextContent.setAttribute('class', 'text-main');

        // title
        const title = document.createElement('div');
        title.setAttribute('class', 'content-title');

        const titleTxt = document.createTextNode(news['title']);
        title.appendChild(titleTxt);

        newTextContent.appendChild(title);



        // body
        const body = document.createElement('div');
        body.setAttribute('class', 'content-context');

        const bodyTxt = document.createTextNode(news['description']);
        body.appendChild(bodyTxt);

        newTextContent.appendChild(body);



        // text section container
        const newTextAdd = document.createElement('div');
        newTextAdd.setAttribute('class', 'text-information-add');

        // author

        // const author = document.createElement('div');
        // author.setAttribute('class', 'content-author');

        // const authorTxt = document.createTextNode(`Author: ${news['author']}`);
        // author.appendChild(authorTxt);

        // newTextAdd.appendChild(author);

        const sourceInfo = document.createElement('div');
        sourceInfo.setAttribute('class', 'content-author')

        
        const sourceTxt = document.createTextNode(`Source: ${news['source']['name']}`);
        sourceInfo.appendChild(sourceTxt);


        newTextAdd.appendChild(sourceInfo);


        // read more

        const readMore = document.createElement('a');
        readMore.setAttribute('class', 'content-link');

        const readMoreTxt = document.createTextNode("Read More");
        
        readMore.setAttribute('href', news['url']);
        readMore.setAttribute('target', '_blank');

        readMore.appendChild(readMoreTxt);

        newTextAdd.appendChild(readMore);


        
        // main append        
        const image = document.createElement('img');
        image.src = 'image/computer.jpg';
        

        
        newTextContainer.appendChild(textinfo_1);
        newTextContainer.appendChild(newTextContent);
        newTextContainer.appendChild(newTextAdd);

        newNewsPostCont.appendChild(image);
        newNewsPostCont.appendChild(newTextContainer);
   

        newsContainer.appendChild(newNewsPostCont);
        

    }
}




export { NewsPage };
