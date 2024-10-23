let currentIndexEnd = 0;
const slidesEnd = document.querySelectorAll('#game-end .slide');

function moveSlideEnd(direction) {
    slidesEnd.forEach(slide => slide.classList.remove('active', 'inactive', 'hidden'));
    if (direction === 'up') {
        currentIndexEnd = (currentIndexEnd === 0) ? slidesEnd.length - 1 : currentIndexEnd - 1;
    } else if (direction === 'down') {
        currentIndexEnd = (currentIndexEnd === slidesEnd.length - 1) ? 0 : currentIndexEnd + 1;
    }
    slidesEnd.forEach((slide, index) => {
        if (index === currentIndexEnd) {
            slide.classList.add('active');
        } else if (index === (currentIndexEnd === 0 ? slidesEnd.length - 1 : currentIndexEnd - 1)) {
            slide.classList.add('inactive');
        } else if (index === (currentIndexEnd === slidesEnd.length - 1 ? 0 : currentIndexEnd + 1)) {
            slide.classList.add('inactive');
        } else {
            slide.classList.add('hidden');
        }
    });
    const slideHeightEnd = slidesEnd[0].clientHeight;
    const offsetEnd = -currentIndexEnd * slideHeightEnd;
    document.querySelector('#game-end .slides-container').style.transform = `translateY(${offsetEnd}px)`;
}
slidesEnd[currentIndexEnd].classList.add('active');
