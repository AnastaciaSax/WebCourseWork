// SLIDER

const visibleSlidesByScreen = () => {
  const w = window.innerWidth;
  return w <= 768 ? 1 : w <= 1024 ? 2 : 3;
};

const sliderContainer = document.querySelector(".slider");
const slidesContainer = document.querySelector(".slides");
const btnPrev = document.querySelector(".prev");
const btnNext = document.querySelector(".next");

let currentIndex = 0;
let visibleSlides = visibleSlidesByScreen();
let slideStep = 0;
let totalOriginal = 0;

// Обновляем слайды и создаём клоны
function initSlider() {
  visibleSlides = visibleSlidesByScreen();
  const original = Array.from(document.querySelectorAll(".slide:not(.clone)"));
  totalOriginal = original.length;

  slidesContainer.innerHTML = "";

  const clonesBefore = original.slice(-visibleSlides).map(s => cloneSlide(s));
  const clonesAfter = original.slice(0, visibleSlides).map(s => cloneSlide(s));

  clonesBefore.forEach(s => slidesContainer.appendChild(s));
  original.forEach(s => slidesContainer.appendChild(s));
  clonesAfter.forEach(s => slidesContainer.appendChild(s));

  currentIndex = visibleSlides;
  updateDimensions();
}

// Клонирование слайда
function cloneSlide(slide) {
  const clone = slide.cloneNode(true);
  clone.classList.add("clone");
  return clone;
}

// Устанавливаем размеры и шаг
function updateDimensions() {
  const containerWidth = sliderContainer.clientWidth;
  const gap = parseFloat(getComputedStyle(slidesContainer).gap) || 0;
  const slideWidth = Math.round((containerWidth - gap * (visibleSlides - 1)) / visibleSlides);

  document.querySelectorAll(".slide").forEach(slide => {
    slide.style.flex = `0 0 ${slideWidth}px`;
    slide.style.height = "244px";
  });

  slideStep = slideWidth + gap;
  updateSlider();
}

// Смещение слайдера
function updateSlider() {
  slidesContainer.style.transform = `translateX(-${currentIndex * slideStep}px)`;
}

// Кнопки
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

// Циклический эффект
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

  // Включаем обратно анимацию
  setTimeout(() => {
    slidesContainer.style.transition = "transform 0.5s ease-in-out";
  }, 0);
});

// При изменении размера
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
