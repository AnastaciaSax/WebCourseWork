// SLIDER

// Определяем, сколько слайдов показывать
const visibleSlidesByScreen = () => {
  const w = window.innerWidth;
  if (w <= 767) return 1;      // для экранов до 767px — 1 слайд
  if (w <= 1024) return 2;     // для 768–1024px — 2 слайда
  return 3;                    // для шире 1024px — 3 слайда
};

const sliderContainer = document.querySelector(".slider");
const slidesContainer = document.querySelector(".slides");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

let currentIndex = 0;
let visibleSlides = visibleSlidesByScreen();
let slideStep = 0;
let totalOriginal = 0;

// Инициализация слайдера
function initSlider() {
  visibleSlides = visibleSlidesByScreen(); // Пересчитываем видимые слайды
  const original = Array.from(document.querySelectorAll(".slide:not(.clone)"));
  totalOriginal = original.length;

  slidesContainer.innerHTML = "";

  // Клонируем слайды для бесконечного цикла
  const clonesBefore = original.slice(-visibleSlides).map(cloneSlide);
  const clonesAfter  = original.slice(0, visibleSlides).map(cloneSlide);

  clonesBefore.forEach(s => slidesContainer.appendChild(s));
  original.forEach    (s => slidesContainer.appendChild(s));
  clonesAfter .forEach(s => slidesContainer.appendChild(s));

  currentIndex = visibleSlides;
  updateDimensions();
}

// Функция клонирования одного слайда
function cloneSlide(slide) {
  const clone = slide.cloneNode(true);
  clone.classList.add("clone");
  return clone;
}

// Обновление размеров слайдов и расчёт шага
function updateDimensions() {
  const containerWidth = sliderContainer.clientWidth;
  const gap = parseFloat(getComputedStyle(slidesContainer).gap) || 0;
  const slideWidth = Math.round((containerWidth - gap * (visibleSlides - 1)) / visibleSlides);
  const slideHeight = window.innerWidth <= 480 ? "180px" : "244px";

  document.querySelectorAll(".slide").forEach(slide => {
    slide.style.flex   = `0 0 ${slideWidth}px`;
    slide.style.height = slideHeight;
  });

  slideStep = slideWidth + gap;
  updateSlider();
}

// Смещение карусели
function updateSlider() {
  slidesContainer.style.transform = `translateX(-${currentIndex * slideStep}px)`;
}

// Обработчики кнопок
btnNext.addEventListener("click", () => {
  currentIndex++;
  slidesContainer.style.transition = "transform 0.5s ease-in-out";
  updateSlider();
});

btnPrev.addEventListener("click", () => {
  currentIndex--;
  slidesContainer.style.transition = "transform 0.5s ease-in-out";
  updateSlider();
});

// Зацикливание при переходе через клоны
slidesContainer.addEventListener("transitionend", () => {
  if (currentIndex >= totalOriginal + visibleSlides) {
    slidesContainer.style.transition = "none";
    currentIndex = visibleSlides;
    updateSlider();
  }
  if (currentIndex < visibleSlides) {
    slidesContainer.style.transition = "none";
    currentIndex = totalOriginal + currentIndex;
    updateSlider();
  }
  // Возвращаем плавность анимации
  setTimeout(() => {
    slidesContainer.style.transition = "transform 0.5s ease-in-out";
  }, 0);
});

// Свайп-жесты для мобильных
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

// При изменении размера экрана пересоздаём слайды
window.addEventListener("resize", () => {
  initSlider();
});

// Запуск
initSlider();

//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
