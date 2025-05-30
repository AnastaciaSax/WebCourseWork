// slider
const visibleSlidesByScreen = () => {
  const w = window.innerWidth;
  if (w <= 767) return 1;
  if (w <= 1024) return 2;
  return 3;
};

const sliderContainer = document.querySelector(".slider");
const slidesContainer = document.querySelector(".slides");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");
const slides = document.querySelectorAll(".slide");

// В начальном состоянии currentIndex = 0, чтобы первый слайд был полностью виден
let currentIndex = 0;
let visibleSlides = visibleSlidesByScreen();
let slideStep = 0; // Шаг прокрутки – ширина одного слайда плюс gap

// Функция для пересчёта размеров слайдов и шага прокрутки
function updateDimensions() {
  const containerWidth = sliderContainer.clientWidth;
  // Получаем gap из CSS (если не задан – по умолчанию 27px)
  const computedGap = parseFloat(getComputedStyle(slidesContainer).gap) || 27;
  // Ширина каждого слайда рассчитывается так, чтобы ровно visibleSlides умещались в контейнере с учётом gap
  const slideWidth = (containerWidth - computedGap * (visibleSlides - 1)) / visibleSlides;
  
  slides.forEach(slide => {
    slide.style.flex = `0 0 ${slideWidth}px`;
  });
  
  // Шаг прокрутки – совокупная ширина слайда и промежутка
  slideStep = slideWidth + computedGap;
}

// Функция для обновления прокрутки слайдера с плавной анимацией
function updateSlider() {
  slidesContainer.style.transform = `translateX(-${currentIndex * slideStep}px)`;
  
  // Если currentIndex равен нулю – левый край, отключаем кнопку «prev»
  btnPrev.disabled = (currentIndex <= 0);
  // Правая граница: последний видимый набор слайдов соответствует currentIndex = slides.length - visibleSlides
  btnNext.disabled = (currentIndex >= (slides.length - visibleSlides));
}

// Инициализация слайдера
function initSlider() {
  visibleSlides = visibleSlidesByScreen();
  updateDimensions();
  updateSlider();
}

// Обработчик клика по кнопке "следующий"
btnNext.addEventListener("click", () => {
  if (currentIndex < (slides.length - visibleSlides)) {
    currentIndex += 0.5; // прокручиваем на полслайда
    updateSlider();
  }
});

// Обработчик клика по кнопке "предыдущий"
btnPrev.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex -= 0.5;
    updateSlider();
  }
});

// Поддержка свайпа (touch)
let startX = 0;
slidesContainer.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});
slidesContainer.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (diff > 50) {
    btnNext.click();
  } else if (diff < -50) {
    btnPrev.click();
  }
});

// Пересчитываем размеры при изменении окна
window.addEventListener("resize", () => {
  initSlider();
});

// Инициализация слайдера при загрузке страницы
initSlider();
//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
