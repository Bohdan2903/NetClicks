
//https://api.themoviedb.org/3/search/tv?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
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


const loading = document.createElement('div');
loading.className = 'loading';

const DBService = class {
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
        return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);
    }
    
    getTvShow = id =>{
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
};


const renderCard = responce =>{
    
    tvShowsList.textContent = '';
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
};

searchForm.addEventListener('submit', event =>{
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if(value){
        tvShows.append(loading);
        new DBService().getSearchResult(value).then((renderCard));
    }
    
    searchFormInput.value = '';
})




//открытие и закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    const target = event.target;
    if(!target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', () => {
    event.preventDefault();
     const target = event.target;
     const dropdown = target.closest('.dropdown');
     if(dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
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

tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
   
    if(card) {
        preloader.style.display = 'block';
        new DBService().getTvShow(card.id)
        .then(data => {
            tvCardImg.src = IMG_URL + data.poster_path;
            tvCardImg.alt = data.name;
            modalTitle.textContent = data.name;
            genresList.innerHTML = data.genres.reduce((acc, item) => {
                return `${acc} <li> ${item.name} </li>`
            }, '');
            rating.textContent = data.vote_average;
            description.textContent = data.overview;
            modalLink.href = data.homepage;
            preloader.style.display = 'none';
        })
        .then(() =>{
            
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');
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

