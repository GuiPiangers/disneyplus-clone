const MovieCarouselItem = (props)=>{
    return`
        <li class="movie-carousel__item" data-carousel = "item" data-id="${props.id}">
            <a href="/${props.slug}" class="movie-carousel__link">
                <img class="movie-carousel__img" src="${props.imageCover}" alt="${props.title}">
            </a>
        </li>
`
}

export default MovieCarouselItem