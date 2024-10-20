let galleryCurrentIndex = 1; // Устанавливаем индекс для активного слайда на 1
const gallerySlides = document.querySelectorAll('.slide-gal'); // Изменено имя переменной

function moveGallerySlide(direction) {
    // Сбрасываем все слайды на неактивное состояние
    gallerySlides.forEach(slide => slide.classList.remove('active', 'inactive', 'hidden'));

    // Рассчитываем новый индекс в зависимости от направления
    if (direction === 'left') {
        galleryCurrentIndex = (galleryCurrentIndex === 0) ? gallerySlides.length - 1 : galleryCurrentIndex - 1;
    } else if (direction === 'right') {
        galleryCurrentIndex = (galleryCurrentIndex === gallerySlides.length - 1) ? 0 : galleryCurrentIndex + 1;
    }

    // Обновляем классы для текущего слайда и соседних
    gallerySlides.forEach((slide, index) => {
        if (index === galleryCurrentIndex) {
            slide.classList.add('active');
        } else if (index === (galleryCurrentIndex === 0 ? gallerySlides.length - 1 : galleryCurrentIndex - 1)) {
            slide.classList.add('inactive');
        } else if (index === (galleryCurrentIndex === gallerySlides.length - 1 ? 0 : galleryCurrentIndex + 1)) {
            slide.classList.add('inactive');
        } else {
            slide.classList.add('hidden');
        }
    });

    // Управление горизонтальным расположением всех слайдов в контейнере
    const slideWidth = gallerySlides[0].clientWidth + 20; // Учтите отступы
    const offset = -galleryCurrentIndex * slideWidth;
    document.querySelector('.galry-cont').style.transform = `translateX(${offset}px)`; // Изменено на translateX
}

// Устанавливаем начальное состояние карусели
gallerySlides[galleryCurrentIndex].classList.add('active');
