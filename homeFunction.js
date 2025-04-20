/* slider */

const visibleSlides = 3;

// Элементы
const sliderContainer = document.querySelector('.slider');
const slidesContainer = document.querySelector('.slides');
const originalSlides = Array.from(document.querySelectorAll('.slide'));
const totalOriginal = originalSlides.length;

// Функция клонирования: последние visibleSlides в начало, первые visibleSlides в конец
function cloneSlides() {
  originalSlides.slice(-visibleSlides).forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    slidesContainer.insertBefore(clone, slidesContainer.firstChild);
  });
  originalSlides.slice(0, visibleSlides).forEach(slide => {
    const clone = slide.cloneNode(true);
    clone.classList.add('clone');
    slidesContainer.appendChild(clone);
  });
}
cloneSlides();

// Получаем полный список слайдов (оригиналы + клоны)
const allSlides = Array.from(document.querySelectorAll('.slide'));

// Устанавливаем начальный индекс на первый оригинальный слайд (учитывая, что спереди уже есть клоны)
let currentIndex = visibleSlides;
let slideStep = 0; // шаг (ширина слайда + gap) – вычисляется в updateDimensions()

// Функция для адаптивной установки размеров слайдов с учётом gap
function updateDimensions() {
  const containerWidth = sliderContainer.clientWidth;
  const computedGap = parseFloat(getComputedStyle(slidesContainer).gap) || 0;
  
  // Вычитаем суммарный gap между слайдами
  const availableWidth = containerWidth - computedGap * (visibleSlides - 1);
  
  // Вычисляем ширину каждого слайда
  const slideWidth = Math.round(availableWidth / visibleSlides);
  
  allSlides.forEach(slide => {
    slide.style.flex = `0 0 ${slideWidth}px`;
    slide.style.height = '244px';
  });
  
  // Шаг смещения: ширина слайда плюс gap
  slideStep = slideWidth + computedGap;
  updateSlider();
}

// Функция обновления смещения слайдов
function updateSlider() {
  slidesContainer.style.transform = `translateX(-${currentIndex * slideStep}px)`;
}

// Обработчики для кнопок переключения
document.querySelector('.next').addEventListener('click', () => {
  currentIndex++;
  slidesContainer.style.transition = 'transform 0.5s ease-in-out';
  updateSlider();
});

document.querySelector('.prev').addEventListener('click', () => {
  currentIndex--;
  slidesContainer.style.transition = 'transform 0.5s ease-in-out';
  updateSlider();
});

// После завершения перехода проверяем, не в зоне клонов
slidesContainer.addEventListener('transitionend', () => {
  // Если движемся вправо и достигли правой клонированной области
  if (currentIndex >= totalOriginal + visibleSlides) {
    slidesContainer.style.transition = 'none';
    currentIndex = visibleSlides;
    updateSlider();
    setTimeout(() => {
      slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    }, 0);
  }
  
  // Если движемся влево и оказались в левой клонированной области
  if (currentIndex < visibleSlides) {
    slidesContainer.style.transition = 'none';
    currentIndex = totalOriginal + currentIndex;
    updateSlider();
    setTimeout(() => {
      slidesContainer.style.transition = 'transform 0.5s ease-in-out';
    }, 0);
  }
});

// Обновляем размеры слайдов при изменении размера окна
window.addEventListener('resize', updateDimensions);
updateDimensions();