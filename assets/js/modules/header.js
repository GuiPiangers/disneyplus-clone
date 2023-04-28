const header = document.querySelector('[data-header]')
const openNavSubmenu = document.querySelector('[data-open-navsubmenu]')
const navSubmenu = document.querySelector('[data-navsubmenu]')
const userMenu = document.querySelector('[data-usermenu]')
const userOpenMenu = document.querySelector('[data-open-usermenu]')

function onWindowScroll(){
    if(window.scrollY > 20){
        header.style.backgroundColor =  '#0C0D14'
    }
    else{
        header.style.backgroundColor =  'transparent'
    }
}

function onTouchOpenNavSubmenu(event){
    event.preventDefault()
    navSubmenu.classList.toggle('active')
}
function onTouchOpenUSerMenu(event){
    event.preventDefault()
    userMenu.classList.toggle('active')
}

function setListeners(){
    window.addEventListener('scroll', onWindowScroll)
    openNavSubmenu.addEventListener('touchstart',  onTouchOpenNavSubmenu)
    userOpenMenu.addEventListener('touchstart',  onTouchOpenUSerMenu)
}

function init(){
    setListeners()
}

export default {
    init
}