
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList =  document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvCard =  document.querySelectorAll('.tv-card');
const tvShows =  document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const preloader = document.querySelector('.preloader');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsHead = document.querySelector('.tv-shows__head');
const posterWrapper = document.querySelector('.poster__wrapper');
const modalContent = document.querySelector('.modal__content');
const pagination = document.querySelector('.pagination');

const loading = document.createElement('div');
loading.className = 'loading';

class DBService {
    constructor () {
        this.API_KEY = '7f9ef795446e47ae9bee0ea7ddb8caa1';
        this.SERVER = 'https://api.themoviedb.org/3';
    }
    getData = async (url) => {
        
        const res = await fetch(url);
        if(res.ok){
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
        return this.getData(this.temp);
    }
    
    getNextPage = page =>{
        return this.getData(this.temp + '&page=' + page);
    }
    getTvShow = id => {
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
    
    getTopRated = () => {
        return this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getPopular = () => {
        return this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getToday = () => {
        return this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    }
    getWeek = () => {
        return this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    }
}

const dbService = new DBService();

const renderCard = (responce, target) =>{
    tvShowsList.textContent = '';

    console.log(responce);

    if(!responce.total_results){
        loading.remove();
        tvShowsHead.textContent = 'Результатов нет';
        tvShowsHead.style.color = 'red'
        return;
    }

    tvShowsHead.textContent = target? target.textContent :'Результат поиска';
    tvShowsHead.style.color = 'green';

    responce.results.forEach(item => {
        const {
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote,
            id
            } = item;
            
         
        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL+ backdrop : '';
        const voteElem = vote ? ` <span class="tv-card__vote">${vote}</span>` :  '';
        const card = document.createElement('li');
        card.classList.add('tv-shows__item'); 
        card.innerHTML = `
                <a href="#" id='${id}' class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                    src="${posterImg}"
                    data-backdrop='${backdropIMG}'
                    alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
         `; 

         loading.remove();
         tvShowsList.append(card);
      });
      pagination.textContent = '';
      if( !target && responce.total_pages > 1){
          for(let i = 1; i <= responce.total_pages; i++){
              pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
          }
      }
};

searchForm.addEventListener('submit', event =>{
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if(value){
        tvShows.append(loading);
        dbService.getSearchResult(value).then((renderCard));
    }
    
    searchFormInput.value = '';
});

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    });
};


//открытие и закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if(!target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});

//левое меню поиска
leftMenu.addEventListener('click', () => {
    event.preventDefault();
     const target = event.target;
     const dropdown = target.closest('.dropdown');
     if(dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
        }

     if(target.closest('#top-rated')){
        tvShows.append(loading);
        dbService.getTopRated().then((responce) => renderCard(responce, target));
        }

     if(target.closest('#popular')){
        tvShows.append(loading);
        dbService.getPopular().then((responce) => renderCard(responce, target));
        }
        
     if(target.closest('#today')){
        tvShows.append(loading);
        dbService.getToday().then((responce) => renderCard(responce, target));
        }

     if(target.closest('#week')){
        tvShows.append(loading);
        dbService.getWeek().then((responce) => renderCard(responce, target));
        }

     if(target.closest('#search')){
        tvShowsList.textContent = '';
        tvShowsHead.textContent = 'Введите Ваш запрос';
        tvShowsHead.style.color = 'black';
        }
});

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if(card){
        const img = card.querySelector('.tv-card__img');
        const changeImage = img.dataset.backdrop;
        if(changeImage){
            img.dataset.backdrop = img.src;
            img.src = changeImage;
        }
     }
};
tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);

//откртытие модалки
tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
   
    if(card) {
        preloader.style.display = 'block';
         
        dbService.getTvShow(card.id)
        .then(data => {
             if(data.poster_path){
                tvCardImg.src = IMG_URL + data.poster_path;
                tvCardImg.alt = data.name;
                posterWrapper.style.display = 'block';
                modalContent.style.paddingLeft = '';
                 } else {
                     posterWrapper.style.display = 'none';
                     modalContent.style.paddingLeft = '25px';
                 };
            modalTitle.textContent = data.name;
            genresList.innerHTML = data.genres.reduce((acc, item) => {
                return `${acc} <li> ${item.name} </li>`
            }, '');

            rating.textContent = data.vote_average;
            description.textContent = data.overview;
           
            modalLink.href = data.homepage;
            
        })
        .then(() =>{
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
        })
        .finally(() => {
            preloader.style.display = 'none';
        })
       
    }
});

modal.addEventListener('click', event => {
    const target = event.target;
    if(target.closest('.cross')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if(target.classList.contains('pages')) {
        tvShows.append(loading);
        dbService.getNextPage(target.textContent).then(renderCard);
    }
})