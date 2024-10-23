let currentIndex = 0;
const slides = document.querySelectorAll('.slide');

function moveSlide(direction) {
    slides.forEach(slide => slide.classList.remove('active', 'inactive', 'hidden'));
    if (direction === 'up') {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
    } else if (direction === 'down') {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
    }
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.classList.add('active');
        } else if (index === (currentIndex === 0 ? slides.length - 1 : currentIndex - 1)) {
            slide.classList.add('inactive');
        } else if (index === (currentIndex === slides.length - 1 ? 0 : currentIndex + 1)) {
            slide.classList.add('inactive');
        } else {
            slide.classList.add('hidden');
        }
    });
    const slideHeight = slides[0].clientHeight;
    const offset = -currentIndex * slideHeight;
    document.querySelector('.slides-container').style.transform = `translateY(${offset}px)`;
}
slides[currentIndex].classList.add('active');

