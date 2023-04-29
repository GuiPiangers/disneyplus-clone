const slideItems = document.querySelectorAll('[data-banner="item"]')
const slider = document.querySelector('[data-banner="slider"]')
const btnPrevious = document.querySelector('[data-banner="btn-previous"]')
const btnNext = document.querySelector('[data-banner="btn-next"]')
const btnsControl = document.querySelectorAll('[data-banner="btn-control"]')
const slideTitles = document.querySelectorAll('[data-banner = "title"]')

const state = {
    mouseDownPosition: 0,
    lastTranslatePosition: 0,
    currentSlidePosition: 0,
    movementPosition: 0,
    currentSlideIndex: 0,
}

function preventDefault(event){
    event.preventDefault()
}

function translateSlide(position){
    state.lastTranslatePosition = position
    slider.style.transform = `translateX(${position}px)`

}

function getTranslatePositon(index){
    const slide = slideItems[index]
    const margin = (document.body.clientWidth - slide.offsetWidth) / 2
    const centerPosition = margin - (slide.offsetWidth * index)
    return centerPosition
}

function animateTransition(active){
    if(active){
        slider.style.transition = 'transform .3s'
    }
    else{
        slider.style.removeProperty('transition')
    }
}

function activeBtnControl(index){
    const btnControl = btnsControl[index]
    btnsControl.forEach(btnControl =>{
        btnControl.classList.remove('active')
    })
    btnControl.classList.add('active')
}

function onBtnControlClick(event, index){
    setVisibleSlide(index)
}

function activeSlideTitle(index){
    const slideTitle = slideTitles[index]
    slideTitles.forEach(slideTitle =>{
        slideTitle.classList.remove('active')
    })
    slideTitle.classList.add('active')
}

function setVisibleSlide(index){
    const position = getTranslatePositon(index)
    state.currentSlideIndex = index

    activeBtnControl(index)
    activeSlideTitle(index)
    animateTransition(true)
    translateSlide (position)
}

function forwardSlide(){
    if(state.currentSlideIndex < slideItems.length - 1){
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
    state.movementPosition = event.clientX - state.mouseDownPosition
    translateSlide(event.clientX - state.currentSlidePosition)
}

function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}

function onTouchStart(event, index){
    const slide = event.currentTarget
    event.clientX = event.touches[0].clientX
    onMouseDown(event, index)
    slide.addEventListener('touchmove', onTouchMove)
}

function onTouchEnd(event){
    const slide = event.currentTarget
    slide.removeEventListener('mousemove', onMouseMove)
    onMouseUp(event)
}

function onMouseDown(event, index){
    const slide = event.currentTarget
    state.mouseDownPosition = event.clientX
    state.currentSlidePosition = event.clientX - state.lastTranslatePosition
    state.currentSlideIndex = index
    
    animateTransition(false)
    slide.addEventListener('mousemove', onMouseMove)
}

function onMouseUp(event){
    const minToChangeSlide = event.type.includes('touch') ? 50 : 150
    const slide = event.currentTarget
    if(state.movementPosition > minToChangeSlide){
        backwardSlide()
    }
    else if(state.movementPosition < -minToChangeSlide){
        forwardSlide()
    }else{
        setVisibleSlide(state.currentSlideIndex)
    }
    slide.removeEventListener('mousemove', onMouseMove)
}
function onMouseLeave(event){
    const slide = event.currentTarget
    slide.removeEventListener('mousemove', onMouseMove)
}

function setListeners(){
    let resizeTimeOut
    btnNext.addEventListener('click', forwardSlide)
    btnPrevious.addEventListener('click', backwardSlide)
    slideItems.forEach((slide, index) =>{
    
        const link = slide.querySelector('a')
        link.addEventListener('click', preventDefault)
        slide.addEventListener('dragstart', preventDefault)
    
        slide.addEventListener('mousedown', (event)=>{
            onMouseDown(event, index)
        })
        slide.addEventListener('mouseup', onMouseUp)
        slide.addEventListener('mouseleave', onMouseLeave)

        btnsControl[index].addEventListener("click", (event)=>{
            onBtnControlClick(event, index)
        })

        slide.addEventListener('touchstart', (event)=>{
            onTouchStart(event, index)
        })
        slide.addEventListener('touchend', onTouchEnd)
    })

    window.addEventListener('resize', event =>{
        clearTimeout(resizeTimeOut)
        resizeTimeOut = setTimeout(()=>{
            setVisibleSlide(state.currentSlideIndex)
        }, 500)       
    })
}


function init(){
    setVisibleSlide(1)
    setListeners()
}

export default {
    init
}