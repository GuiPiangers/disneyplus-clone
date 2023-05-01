const Collection = (props)=>{
    return`
        <div class="collection" data-carousel = "collection" data-id="${props.id}">
            <h3 class="collection__title">${props.title}</h3>
            <div class="movie-carousel">
                <button class="arrow-slider arrow-slider--left fa-solid fa-chevron-left"  data-carousel = "btn-previous"></button>
                <button class="arrow-slider arrow-slider--right fa-solid fa-chevron-right"  data-carousel = "btn-next"></button>

                <ul class="movie-carousel__list" data-carousel = "list"></ul>
            </div>
        </div>
    `
}
export default Collection