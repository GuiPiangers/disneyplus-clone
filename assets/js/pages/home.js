import UserProfile from "../componnents/user-profile.js"
import BannerSliderItem from "../componnents/banner-slider-item.js"
import ControlSliderItem from "../componnents/control-slider-item.js"
import Collection from "../componnents/collection.js"
import MovieCarouselItem from "../componnents/movie-carousel-item.js"
import bannerSliderModule from "../modules/banner-slider.js"
import collectionsModule from "../modules/collections.js"
import headerModule from "../modules/header.js"

const Home = (data) =>{
    const userProfilesElement = document.querySelector('[data-usermenu="user-profiles"]')
    const bannerSliderElement = document.querySelector('[data-banner="slider"]')
    const controlsSliderElement = document.querySelector('[data-banner="controls"]')
    const collectionsElement = document.querySelector('[data-carousel="collections"]')
    const { banners, categories, movies, userProfiles } = data

    for (const profile of userProfiles){
        userProfilesElement.innerHTML += UserProfile(profile)
    }
    for (const banner of banners){
        bannerSliderElement.innerHTML += BannerSliderItem(banner)
        controlsSliderElement.innerHTML += ControlSliderItem()
    }

    for (const category of categories){
        collectionsElement.innerHTML += Collection(category)
        const collectionElement = document.querySelector(`[data-id="${category.id}"]`)
        const movieCarouselListElement = collectionElement.querySelector('[data-carousel="list"]')
        const collectionMovies = movies.filter((movie)=> 
            movie.categories.includes(category.id))
        for (const movie of collectionMovies){
            movieCarouselListElement.innerHTML += MovieCarouselItem(movie)
        }
    }

    headerModule().init()
    bannerSliderModule().init()
    collectionsModule().init()
}

export default Home