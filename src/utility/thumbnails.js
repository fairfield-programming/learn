function getImages(markdown) {

    return markdown.filter(element => element.type === 'img')

}

function getThumbnailUrl(images) {

    return (images[Math.floor(images.length * Math.random())] || { src: undefined }).src;

}

function getThumbnailUrlFromMarkdown(markdown) {

    return getThumbnailUrl(
        getImages(
            markdown
        )
    );

}

module.exports = {
    getImages,
    getThumbnailUrl,
    getThumbnailUrlFromMarkdown
}