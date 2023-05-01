const BannerSliderItem = (props)=>{
    return`
        <div class="banner-slide__item"  data-banner="item" data-id="${props.id}">
            <a href="/${props.slug}" class="banner-slide__link">
                <img class="banner-slide__image" src="${props.imageCover}" alt="${props.title}">
                <img class="banner-slide__title" data-banner="title" src="${props.imageTitle}" alt="${props.title}">
            </a>
        </div>
    `
}
export default BannerSliderItem