const collections = document.querySelectorAll('[data-carousel="collection"]')
const arrayCollectionData = []
let currentCollectionIndex = 0
let itemsperSlide = 5 

function preventDefault(event){
    event.preventDefault()
}

function translateSlide(position){
    const { state, carouselList } = arrayCollectionData[currentCollectionIndex]
    state.lastTranslatePosition = position
    carouselList.style.transform = `translateX(${position}px)`
}

function getTranslatePosition(slideIndex){
    const { state, carouselItems } = arrayCollectionData[currentCollectionIndex]

    const item = carouselItems[state.currentItemIndex]
    const itemWidth = item.offsetWidth
    const bodyWidth = document.body.clientWidth
    const slideWidth = itemWidth * itemsperSlide
    const margin = (bodyWidth - slideWidth) / 2
    return margin - (slideWidth * slideIndex)
}

function animateTransition(active){
    const { carouselList } = arrayCollectionData[currentCollectionIndex]

    if(active){
        carouselList.style.transition = 'transform 0.3s'
    }
    else{
        carouselList.style.removeProperty('transition')
    }
}

function activeCurrentItems(){
    const { carouselItems, state } = arrayCollectionData[currentCollectionIndex]
    carouselItems.forEach((item, itemIndex) =>{
        const firstItemIndex = state.currentSlideIndex * itemsperSlide
        item.classList.remove('active')
        if(itemIndex >= firstItemIndex && itemIndex < firstItemIndex + itemsperSlide){
        item.classList.add('active')            
        }
    })
}

function setArrowButtonsDisplay(){
    const { btnPrevious, btnNext, state} = arrayCollectionData[currentCollectionIndex]
    btnPrevious.style.display = state.currentSlideIndex === 0 ? 'none' : 'block'
    btnNext.style.display = state.currentSlideIndex === (getLastSlideIndex()) ? 'none' : 'block'
}

function setVisibleSlide(slideIndex){
    const { state } = arrayCollectionData[currentCollectionIndex]
    const traslatePosition = getTranslatePosition(slideIndex)
    
    state.currentSlideIndex = slideIndex
    activeCurrentItems()
    setArrowButtonsDisplay()
    animateTransition(true)
    translateSlide(traslatePosition)
}

function getLastSlideIndex(){
    const { carouselItems } = arrayCollectionData[currentCollectionIndex]

    const lastItemIndex = carouselItems.length - 1
    return Math.floor(lastItemIndex / itemsperSlide)
}

function forwardSlide(){
    const { state } = arrayCollectionData[currentCollectionIndex]

    if(state.currentSlideIndex < getLastSlideIndex()){
        setVisibleSlide(state.currentSlideIndex + 1)
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
}
function backwardSlide(){
    const { state } = arrayCollectionData[currentCollectionIndex]

    if(state.currentSlideIndex > 0){
        setVisibleSlide(state.currentSlideIndex - 1)
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
}

function onMouseMove(event){
    const { state } = arrayCollectionData[currentCollectionIndex]
    const position = event.clientX - state.currentSlidePosition
    state.movement = event.clientX - state.mouseDownPosition
    translateSlide(position)
}
function onMouseDown(event, itemIndex){
    const { state } = arrayCollectionData[currentCollectionIndex]
    state.currentSlidePosition = event.clientX - state.lastTranslatePosition
    state.mouseDownPosition = event.clientX
    state.currentItemIndex = itemIndex
    const item = event.currentTarget

    animateTransition(false)
    item.addEventListener('mousemove', onMouseMove)
}
function onMouseUp(event){
    const minToChangeSlide = event.type.includes('touch') ? 50 : 150
    const { state } = arrayCollectionData[currentCollectionIndex]

    if(state.movement > minToChangeSlide){
        backwardSlide()
    }
    else if(state.movement < -minToChangeSlide){
        forwardSlide()
    }
    else{
        setVisibleSlide(state.currentSlideIndex)
    }
    state.movement = 0
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)

}
function onMouseLeave(event){
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)
}

function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}

function onTouchStart(event, itemIndex){
    const item = event.currentTarget
    event.clientX = event.touches[0].clientX
    onMouseDown(event, itemIndex)
    item.addEventListener('touchmove', onTouchMove)
}

function onTouchEnd(event){
    const item = event.currentTarget
    item.removeEventListener('mousemove', onMouseMove)
    onMouseUp(event)
}

function insertColletionData(collection){
    arrayCollectionData.push({
        carouselList: collection.querySelector('[data-carousel="list"]'),
        carouselItems: collection.querySelectorAll('[data-carousel="item"]'),
        btnPrevious: collection.querySelector('[data-carousel="btn-previous"]'),
        btnNext: collection.querySelector('[data-carousel="btn-next"]'),
        state: {
            mouseDownPosition: 0,
            movement:0,
            lastTranslatePosition: 0,
            currentSlidePosition: 0,
            currentItemIndex: 0,
            currentSlideIndex: 0
        }        
    })
}

function setItemsPerSlide(){
    if(document.body.clientWidth < 600){
        itemsperSlide = 2
        return
    }
    if(document.body.clientWidth < 1024){
        itemsperSlide = 3
        return
    }

    itemsperSlide = 5
}

function setWindowResizeListener(){
    let resizeTimeOut
    window.addEventListener('resize', event =>{
        clearTimeout(resizeTimeOut)
        resizeTimeOut = setTimeout(()=>{
            setItemsPerSlide()
            collections.forEach((_, collectionIndex) =>{
                currentCollectionIndex = collectionIndex
                setVisibleSlide(0)
            })
        }, 500)       
    })
}

function setListeners(collectionIndex){
    const { btnNext, btnPrevious, carouselItems } = arrayCollectionData[collectionIndex]
    carouselItems.forEach((item, itemIndex) =>{
        const link = item.querySelector('a')

        link.addEventListener('click', preventDefault)
        item.addEventListener('dragstart', preventDefault)
        item.addEventListener('selectstart', preventDefault)
        item.addEventListener('mousedown', (event)=>{
        currentCollectionIndex = collectionIndex
            onMouseDown(event, itemIndex)
        })
        item.addEventListener('mouseup', onMouseUp)
        item.addEventListener('mouseleave', onMouseLeave)
        item.addEventListener('touchstart', (event)=>{
            currentCollectionIndex = collectionIndex
            onTouchStart(event, itemIndex)
        })
        item.addEventListener('touchend', onTouchEnd)
    })
    btnNext.addEventListener('click', ()=>{
        currentCollectionIndex = collectionIndex
        forwardSlide()
    })
    btnPrevious.addEventListener('click', ()=>{
        currentCollectionIndex = collectionIndex        
        backwardSlide()
    })
}

function init(){
    setItemsPerSlide()
    setWindowResizeListener()
    collections.forEach((collection, collectionIndex) => {
        currentCollectionIndex = collectionIndex
        insertColletionData(collection)
        setListeners(collectionIndex)
        setVisibleSlide(0)
    })

}

export default {
    init
}