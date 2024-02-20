const API_KEY_NewsApi = `cdd4b0ea8b224300ab35acd8f3ed4981`;

let news = [];

const getLatestNews = async () => {
    const url = new URL (
        `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY_NewsApi}`
    );
    console.log("uuu",url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("rrr",response);
    news = data.articles;
    console.log("dddd",news);
};

getLatestNews();
