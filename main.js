const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvCardImg = document.querySelectorAll('.tv-card__img');
//открытие и закрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if(!event.target.closest('.left-menu')){
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', ()=>{
     const target = event.target;
     const dropdown = target.closest('.dropdown');
     if(dropdown){
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
     }
});

tvCardImg.forEach((el) => {
    el.addEventListener('mouseover', (event)=> {
    const target = event.target;
    const dataBackdrop = target.getAttribute('data-backdrop').toString();
    const src = target.getAttribute('src').toString();
    target.setAttribute('src', dataBackdrop);
    el.addEventListener('mouseout', (event)=> {
        const target = event.target;
        target.setAttribute('src', src);
    });
});
});
