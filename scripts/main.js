const API_KEY_NewsApi = `cdd4b0ea8b224300ab35acd8f3ed4981`;

// let keyword = "";
let newsList = [];

const getLatestNews = async () => {
    const url = new URL (
        // `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY_NewsApi}`
        // `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
        `https://news-on.netlify.app/top-headlines`
        // `https://news-on.netlify.app/top-headlines?q=${keyword}&country=kr&pagesize=${PAGE_SIZE}`
    );
    console.log("uuu",url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("rrr",response);
    newsList = data.articles;
    render();
    console.log("dddd",newsList);
};

const render = () => {
    const newsHTML = newsList.map(
        (news) => `<div class="row card_hl">
        <div class="col-lg-4">
            <div class="img_box">
                <img src=${news.urlToImage}>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="article_box">
                <h2>${news.title}</h2>
                <p>${news.description}</p>
                <div class="article_info">
                    ${news.source.name} * ${news.publishedAt}
                </div>
            </div>
        </div>
    </div>`
    ).join('');

    // for (let i = 0; i < 5; i++) {
    //     newsHTML = newsHTML + `<div class="row card_hl">
    //     <div class="col-lg-4">
    //         <div class="img_box">
    //             <img src="/img/00040-2185387814.png">
    //         </div>
    //     </div>
    //     <div class="col-lg-8">
    //         <div class="article_box">
    //             <h2>AI로 만드는 디자인 요소</h2>
    //             <p>Stable Defusion을 이용하여 만들어진 디자인 요소. <br> 그리고 이 사진 한장을 다시 AI를 이용해 멋진 동영상 바탕화면으로 만든 비결 공개</p>
    //             <div class="article_info">
    //                 KBS * 2021-11-11
    //             </div>
    //         </div>
    //     </div>
    // </div>`
    // }

    document.getElementById('headline_list').innerHTML = newsHTML;
}

getLatestNews();

