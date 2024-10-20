let currentIndex = 0;
const slides = document.querySelectorAll('.slide');

function moveSlide(direction) {
    // Сбрасываем все слайды на неактивное состояние
    slides.forEach(slide => slide.classList.remove('active', 'inactive', 'hidden'));

    // Рассчитываем новый индекс в зависимости от направления
    if (direction === 'up') {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
    } else if (direction === 'down') {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
    }

    // Обновляем классы для текущего слайда и соседних
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

    // Управление вертикальным расположением всех слайдов в контейнере
    const slideHeight = slides[0].clientHeight;
    const offset = -currentIndex * slideHeight;
    document.querySelector('.slides-container').style.transform = `translateY(${offset}px)`;
}

// Устанавливаем начальное состояние карусели
slides[currentIndex].classList.add('active');

