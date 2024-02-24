
// * API 관련 설정


    const API_KEY_NewsApi = `cdd4b0ea8b224300ab35acd8f3ed4981`;

    const api_url = `https://news-on.netlify.app`;
    // `https://news-on.netlify.app`; //! 배포시 주소, netlify의 _redirects 기능으로 누나 API 주소 연결
    // `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com`; // ! 누나 API, 테스트 가능하지만 배포는 http인 것 주의
    // `https://newsapi.org/v2`; // ! news-api, 문서> https://newsapi.org/docs

    // ! 기본 국가 설정은 한국어. 테스트시 us <-> kr 전환. 
    const api_country = `kr`; 

// * UI 관련 요소 설정

    const sideBarWidth = "250px";
    // ! css에서 max-width 350px로 제한중

// * 전역 변수 설정


    let url = new URL(
        `${api_url}/top-headlines?country=${api_country}&apiKey=${API_KEY_NewsApi}`
        );

    let newsList = [];

    let page = 1;
    let totalResults = 0;

    const pageSize = 10;
    const pageGroup = 5;
    const groupSize = 5;

    let togglePopupState = "hide";

// * HTML element 요소 - 오브젝트 설정


    const navItems = document.querySelectorAll(".main_nav button");
    const sideNavItems = document.querySelectorAll(".side_nav button");

    const sideBar = document.getElementById("side_bar");

    const searchBox = document.getElementById("search_box");
    const searchBtn = document.getElementById("btn_search");
    const inputBox = document.getElementById("input_box");


// * HTML element 요소 - addEventListener 설정


    // ! Latest 적용되는 nav 첫번째 요소와 구분하여 addEventListener 설정

    navItems.forEach((item,index) => 
    { if(index == 0 ) {
        item.addEventListener("click",(event)=>getLatestNews());
        } else {
        item.addEventListener("click",(event)=>getNewsByCategory(event));
        }
    });

    // ! side nav도 동일하게 설정
    // ? 함수로 묶을수 있지 않을까?

    sideNavItems.forEach((item,index) => 
    { if(index == 0 ) {
        item.addEventListener("click",(event)=>getLatestNews());
        } else {
        item.addEventListener("click",(event)=>getNewsByCategory(event));
        }
    });

    // ! 검색 버튼 및 input 박스

    searchBtn.addEventListener("click",(event)=>getNewsByKeyword());

    inputBox.addEventListener('keyup', function(e){
        if(e.key == 'Enter'){
            getNewsByKeyword()
        }
    })


// * HTML render 관련 함수


    // ! 메인 렌더 함수 - id="headline_list" 아래 각각의 뉴스 card_h1 을 렌더

    
    const render = () => {
        const newsHTML = newsList.map(
            (news) => `<div class="row card_hl">
            <div class="img_box col-lg-4">
                <img src=${news.urlToImage ? news.urlToImage : "img/no-image.png"} onerror="this.onerror=null; this.src='img/404.png';" alt="기사 이미지">
            </div>
            <div class="article_box col-lg-8">
                <h2>${news.title}</h2>
                <p>${news.description == null ? "(기사 내용 없음)":news.description}</p>
                <div class="article_info">
                    ${news.source.name} * ${news.publishedAt.split("T")[0]} / ${news.publishedAt.split("T")[1].slice(0,-1)}
                </div>
            </div>
        </div>`
        ).join('');

            document.getElementById('headline_list').innerHTML = newsHTML;
    }

    // ! 검색 결과가 없는 경우를 위한 랜더 함수

    const renderBlank = () => {

        paginationHTML ="";
        document.getElementById("page_pop").innerHTML = paginationHTML;
        document.getElementById("page_bottom").innerHTML = paginationHTML;

        resetCategory();

        const newsBlank = `<div class="row card_hl">
            <div class="img_box col-lg-4">
                <img src="img/molru.gif"} alt="기사 이미지">
            </div>
            <div class="article_box col-lg-8">
                <div class="no-result">검색된 뉴스가 없습니다.</div>
            </div>
        </div>`
        document.getElementById('headline_list').innerHTML = newsBlank;
    };


    // ! 에러메시지용 렌더 함수

    const renderError = (errorMessage) => {
        const errorHTML = `<div class="alert alert-danger" role="alert">
            ${errorMessage}
        </div>`;

        document.getElementById("headline_list").innerHTML = errorHTML;
    }

// * News API 관련 함수 정의


    // ! 공통으로 뉴스 렌더링 해주는 함수

    const renderNews = async () => {

        try {

            url.searchParams.set("page",page);
            url.searchParams.set("pageSize",pageSize);

            const response = await fetch(url);

            const data = await response.json();
            newsList = data.articles;
            
            console.log("ddd",data);

            totalResults = data.totalResults;
            // console.log("rrr",response);
            // console.log("what?",newsList);

            if(response.status===200) {
                
                if (newsList.length == 0) {
                    renderBlank();
                    return
                }

                render();
                renderPageBox();

            } else {
                throw new Error(data.message);
            }

        } catch(error) {
            // console.log(error);
            renderError(error.message);
        };
        
    }

    // ! (1) 신규 뉴스 가져오기 - navItem[0]로 호출, 시작시 호출

    const getLatestNews = async () => {
        
        navItems.forEach(item => {item.className =""});
        navItems[0].className = "selected";

        url = new URL (
            `${api_url}/top-headlines?country=${api_country}&apiKey=${API_KEY_NewsApi}`
        );

        renderNews();
    };

    // ! (2) 카테고리별 가져오기 - 0번 외의 navItems, 카테고리 버튼 내 입력값을 가져오므로 text에 주의

    const getNewsByCategory = async (event) => {

        page = 1;

        resetCategory();
        event.target.className = "selected";

        const nav_category = event.target.textContent.toLowerCase();
        url = new URL(
            `${api_url}/top-headlines?country=${api_country}&category=${nav_category}&apiKey=${API_KEY_NewsApi}`
        );
        
        renderNews();
    }

    // ! (3) 키워드별 가져오기 - 검색 버튼으로 호출

    const getNewsByKeyword = async (event) => {

        page = 1;

        resetCategory();

        const keyword = document.getElementById("input_box").value;

        if ( !keyword || keyword == "" ) {
            renderBlank();
            return 
            // ! 입력된 키워드가 없는 경우 blank 페이지 렌더
        }

        url = new URL(
            `${api_url}/top-headlines?country=${api_country}&q=${keyword}&apiKey=${API_KEY_NewsApi}`
        );
        
        renderNews();
    }

// * pagination 함수

    const renderPageBox = () => {

        const totalPages = Math.ceil(totalResults / pageSize);

        const pageGroup = Math.ceil(page/groupSize);
        
        let lastPage = pageGroup * groupSize;

        if (lastPage > totalPages) {
            // (lastPage - totalPages)
            lastPage = totalPages
        };

        const firstPage = lastPage - (groupSize - 1)<=0? 1:lastPage - (groupSize - 1);

    
    // ! --- 페이지네이션

        let paginationHTML = ``;



        if (firstPage !== 1){
            paginationHTML += `<li class="page-item"><a class="page-link text-body-tertiary" onclick="moveToPage(${firstPage-1})">&lt;</a></li>`;
        } else {
            // paginationHTML += `<li class="page-item disabled"><a class="page-link")">&lt;</a></li>`;
        }

        for (let i = firstPage; i <= lastPage; i++) {
            if (i == page) {
                paginationHTML += ` <li class="page-item"><a class="page-link active">${i}</a></li>`;
            } else {
                paginationHTML += ` <li class="page-item"><a class="page-link text-body-tertiary" onclick="moveToPage(${i})">${i}</a></li>`;
            }
            
        }

        if (lastPage !== totalPages) {
            paginationHTML += `<li class="page-item"><a class="page-link text-body-tertiary" onclick="moveToPage(${lastPage+1})">&gt;</a></li>`;
        } else {
            // paginationHTML += `<li class="page-item disabled"><a class="page-link")">&gt;</a></li>`;
        }

    // ! <<,>> 제외 하고 팝업창 먼저 렌더

        document.getElementById("page_pop").innerHTML = paginationHTML;


    // ! << , >> 기능 (popup창에는 포함 안됨)

        if (pageGroup !== 1){
            paginationHTML = `<li class="page-item"><a class="page-link text-body-tertiary" onclick="moveToPage(1)">&Lt;</a></li>` + paginationHTML;
        } else {
            // paginationHTML += `<li class="page-item disabled"><a class="page-link")">&Lt;</a></li>`;
        }

        if (lastPage !== totalPages) {
            paginationHTML += `<li class="page-item"><a class="page-link text-body-tertiary" onclick="moveToPage(${totalPages})">&Gt;</a></li>`;
        } else {
            // paginationHTML += `<li class="page-item disabled"><a class="page-link")">&Gt;</a></li>`;
        }

    // ! 나머지 추가하여 화면 하단 페이지네이션 렌더

        document.getElementById("page_bottom").innerHTML = paginationHTML;
        
    };

    const moveToPage = (pageNum) => {
        console.log("ppp",pageNum);
        page = pageNum;
        renderNews();
    }

// * UI 관련 함수 설정


    // ! 검색 버튼 눌렀을 때 투명도 값 변화

    const toggleSearchBox = () => {
        if (searchBox.style.opacity == 0) {
            searchBox.style.opacity = 1;
        } else {
            searchBox.style.opacity = 0;
        }
    };

    // ! 사이드 메뉴 토글용, <햄버거 메뉴 클릭 & 닫기 버튼 클릭시 둘 다 활용>

    const toggleSide = () => { 

        if(sideBar.style.width == sideBarWidth) {
            sideBar.style.width = "0";
        } else {
            sideBar.style.width = sideBarWidth;
        }    
    }

    // !  pagination popup 토글

    const togglePagePopup = (event) => {
        console.log(event);
        console.log("c",document.querySelector(".pagination").style);

        // if (event.target.textContent == ">") {
        if ( togglePopupState == "show") {
            document.querySelector(".page_box").style.display = "none";
            event.target.innerHTML = "&lt;"
            togglePopupState = "hide"
        } else {
            document.querySelector(".page_box").style.display = "block";
            event.target.innerHTML = "&gt"
            togglePopupState = "show"
        }
        
        
    };

    // ! 스크롤 최하단 도착시 pagination popup 숨김

    window.onscroll = function() {
        let windowHeight = window.innerHeight; // 브라우저 창의 높이
        let documentHeight = document.documentElement.scrollHeight; // 문서 전체의 높이
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop; // 현재 스크롤된 높이
        let plusHeight = 60;

            if ( windowHeight + scrollTop >= documentHeight - plusHeight) {

                if (togglePopupState == "show") {
                    document.querySelector('.page_box').style.display = 'none';
                }
                document.querySelector('.page_toggle_box button').style.display = 'none';
            } else {
                if (togglePopupState == "show") {
                    document.querySelector('.page_box').style.display = 'block';
                }
                document.querySelector('.page_toggle_box button').style.display = 'block';
            }
        
    };

    // ! 카테고리 선택 리셋, (navItem 선택시, 검색시)

    const resetCategory = () => {
        navItems.forEach(item => {item.className =""});
    }

    
// * 처음 진입 시 화면 랜더링

    // getLatestNews();
    renderNews();
