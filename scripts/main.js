const API_KEY_NewsApi = `cdd4b0ea8b224300ab35acd8f3ed4981`;

// let keyword = "";
let newsList = [];
const navItems = document.querySelectorAll("nav button");
let searchBtn = document.getElementById("btn_search");

navItems.forEach((item,index) => 
{ if(index == 0 ) {
    item.addEventListener("click",(event)=>getLatestNews());
    } else {
    item.addEventListener("click",(event)=>getNewsByCategory(event));
    }
});

searchBtn.addEventListener("click",(event)=>getNewsByKeyword());

// navItems.forEach((item) => item.addEventListener("click",(event)=>getNewsByCategory(event)));

const getLatestNews = async () => {
    const url = new URL (
        // `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY_NewsApi}`
        // `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
        // `https://news-on.netlify.app/top-headlines`
        // `https://news-on.netlify.app/top-headlines?q=${keyword}&country=kr&pagesize=${PAGE_SIZE}`
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?country=kr`
    );
    // console.log("uuu",url);
    const response = await fetch(url);
    const data = await response.json();
    // console.log("rrr",response);
    newsList = data.articles;
    render();
    // console.log("dddd",newsList);
};

const getNewsByCategory = async (event) => {
    const nav_category = event.target.textContent.toLowerCase();
    // console.log("category",nav_category);
    const url = new URL(
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?country=kr&category=${nav_category}`
        // `https://news-on.netlify.app/top-headlines?country=kr&category=${nav_category}`
        // `https://newsapi.org/v2/top-headlines?country=kr&category=${nav_category}&apiKey=${API_KEY_NewsApi}`
    );
    
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    // console.log("DDD" , data);
    // console.log("Article",newsList);
}

const getNewsByKeyword = async (event) => {
    const keyword = document.getElementById("search_box").value;

    console.log("kw",keyword);

    if ( !keyword || keyword == "" ) {
        renderBlank();
        return
    }

    // console.log("category",nav_category);
    const url = new URL(
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?country=kr&q=${keyword}`
        // `https://news-on.netlify.app/top-headlines?country=kr&category=${nav_category}`
        // `https://newsapi.org/v2/top-headlines?country=kr&category=${nav_category}&apiKey=${API_KEY_NewsApi}`
    );
    
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;

    // console.log("kw-response",response);
    // console.log("kw-list",newsList);
    // console.log("kw-list",newsList.length);

    if (newsList.length == 0) {
        renderBlank();
        return
    }

    render();
    // console.log("DDD" , data);
    // console.log("Article",newsList);
}


const render = () => {
    const newsHTML = newsList.map(
        (news) => `<div class="row card_hl">
        <div class="col-lg-4">
            <div class="img_box">
                <img src=${news.urlToImage ? news.urlToImage : "img/no-image.png"} alt="기사 이미지">
            </div>
        </div>
        <div class="col-lg-8">
            <div class="article_box">
                <h2>${news.title}</h2>
                <p>${news.description == null ? "(기사 내용 없음)":news.description}</p>
                <div class="article_info">
                    ${news.source.name} * ${news.publishedAt.split("T")[0]} / ${news.publishedAt.split("T")[1].slice(0,-1)}
                </div>
            </div>
        </div>
    </div>`
    ).join('');

    document.getElementById('headline_list').innerHTML = newsHTML;
}

const renderBlank = () => {
    const newsBlank = `<div class="row card_hl">
        <div class="col-lg-4">
            <div class="img_box">
                <img src="img/molru.gif"} alt="기사 이미지">
            </div>
        </div>
        <div class="col-lg-8">
            <div class="article_box">
                <div class="no-result">검색된 뉴스가 없습니다.</div>
                </div>
            </div>
        </div>
    </div>`
    document.getElementById('headline_list').innerHTML = newsBlank;
}

getLatestNews();
console.log(navItems);
