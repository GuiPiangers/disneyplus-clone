const carouselList = document.querySelector('[data-carousel="list"]')
const carouselItems = document.querySelectorAll('[data-carousel="item"]')
const btnPrevious = document.querySelector('[data-carousel="btn-previous"]')
const btnNext = document.querySelector('[data-carousel="btn-next"]')

const state = {
    mouseDownPosition: 0,
    movement:0,
    lastTranslatePosition: 0,
    currentSlidePosition: 0,
    currentItemIndex: 0,
    currentSlideIndex: 0
}

function preventDefault(event){
    event.preventDefault()
}

function translateSlide(position){
    state.lastTranslatePosition = position
    carouselList.style.transform = `translateX(${position}px)`
}

function getTranslatePosition(slideIndex){
    const item = carouselItems[state.currentItemIndex]
    const itemWidth = item.offsetWidth
    const bodyWidth = document.body.clientWidth
    const slideWidth = itemWidth * 5
    const margin = (bodyWidth - slideWidth) / 2
    return margin - (slideWidth * slideIndex)
}

function animateTransition(active){
    if(active){
        carouselList.style.transition = 'transform 0.3s'
    }
    else{
        carouselList.style.removeProperty('transition')
    }
}

function setVisibleSlide(slideIndex){
    state.currentSlideIndex = slideIndex
    const traslatePosition = getTranslatePosition(slideIndex)
    animateTransition(true)
    translateSlide(traslatePosition)
}

function forwardSlide(){
    const lastItemIndex = carouselItems.length - 1
    const lastSlideIndex = Math.floor(lastItemIndex / 5)
    if(state.currentSlideIndex < lastSlideIndex){
        setVisibleSlide(state.currentSlideIndex + 1)
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
}
function backwardSlide(){
    if(state.currentSlideIndex > 0){
        setVisibleSlide(state.currentSlideIndex - 1)
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
}

function onMouseMove(event){
    const position = event.clientX - state.currentSlidePosition
    state.movement = event.clientX - state.mouseDownPosition
    translateSlide(position)
}
function onMouseDown(event, index){
    state.currentSlidePosition = event.clientX - state.lastTranslatePosition
    state.mouseDownPosition = event.clientX
    state.currentItemIndex = index
    const item = event.currentTarget

    animateTransition(false)
    item.addEventListener('mousemove', onMouseMove)
}
function onMouseUp(event){
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)

    if(state.movement > 150){
        backwardSlide()
    }
    else if(state.movement < -150){
        forwardSlide()
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
}
function onMouseLeave(event){
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)
}

function setListeners(){
    carouselItems.forEach((item, index) =>{
        const link = item.querySelector('a')

        link.addEventListener('click', preventDefault)
        item.addEventListener('dragstart', preventDefault)
        item.addEventListener('mousedown', (event)=>{
            onMouseDown(event, index)
        })
        item.addEventListener('mouseup', onMouseUp)
        item.addEventListener('mouseleave', onMouseLeave)
    })
    btnNext.addEventListener('click', forwardSlide)
    btnPrevious.addEventListener('click', backwardSlide)
}

function init(){
    setListeners()
    setVisibleSlide(0)
}

export default {
    init
}