/* pagin */
const serviceContainer = document.querySelector(".service-card");
const paginationContainer = document.querySelector(".page");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");

let currentPage = 1;
const servicesPerPage = 4;
let services = [];
let currentPlace = null;
let currentSort = null;
let currentSearch = "";

/* server fetch */
async function fetchServices() {
  try {
    const res = await fetch("http://localhost:3001/services");
    services = await res.json();
    renderPagination();
    renderServices(currentPage);
  } catch (error) {
    console.error("Sorry, loading data ERROR", error);
  }
}

function renderServices(page) {
  serviceContainer.innerHTML = "";

  // Базовая фильтрация
  let filteredServices = [...services];

  if (currentPlace) {
    filteredServices = filteredServices.filter(
      (service) => service.place === currentPlace
    );
  }

  if (currentSearch.trim() !== "") {
    const searchTerm = currentSearch.trim().toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
    );
  }

  if (currentSort) {
    filteredServices.sort((a, b) => {
      if (currentSort === "price") {
        return a.price - b.price;
      } else {
        return a[currentSort].localeCompare(b[currentSort]);
      }
    });
  }

  // Пагинация
  const start = (page - 1) * servicesPerPage;
  const end = start + servicesPerPage;
  const currentServices = filteredServices.slice(start, end);

  // --- Проверка: если ничего не найдено ---
  if (filteredServices.length === 0) {
    const notFound = document.createElement("div");
    notFound.classList.add("not-found-message");
    notFound.textContent = "Sorry, no services found for what you're looking for.";
    serviceContainer.appendChild(notFound);
    return;
  }

  currentServices.forEach((service) => {
    const card = document.createElement("div");
    card.classList.add("service-item");
    card.innerHTML = `
      <div class="service-pic">
        <img src="${service.photoURL}" alt="${service.title}">
      </div>
      <div class="service-info">
        <div class="service-title">
          <h3>${service.title}</h3>
          <p>${service.category}</p>
        </div>
        <p class="price">$ ${service.price}</p>
        <button class="add-to-cart">
          <img src="./Assets/cart.svg" alt="Add to cart">
        </button>
      </div>
    `;
    serviceContainer.appendChild(card);
  });

  // first / last классы
  const items = document.querySelectorAll(".service-item");
  items.forEach((item) => item.classList.remove("first", "last"));
  if (items.length > 0) items[0].classList.add("first");
  if (items.length > 1) items[items.length - 1].classList.add("last");
}


function renderPagination() {
  paginationContainer.innerHTML = "";

  // Та же логика фильтрации и поиска, что и в renderServices
  let filteredServices = [...services];

  if (currentPlace) {
    filteredServices = filteredServices.filter(
      (service) => service.place === currentPlace
    );
  }

  if (currentSearch.trim() !== "") {
    const searchTerm = currentSearch.trim().toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
    );
  }

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i < 10 ? `0${i}` : i;
    pageBtn.classList.add("page-button");
    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderServices(currentPage);
      renderPagination();
    });

    paginationContainer.appendChild(pageBtn);
  }
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderServices(currentPage);
    renderPagination();
  }
});

nextButton.addEventListener("click", () => {
  let filteredServices = [...services];

  if (currentPlace) {
    filteredServices = filteredServices.filter(
      (service) => service.place === currentPlace
    );
  }

  if (currentSearch.trim() !== "") {
    const searchTerm = currentSearch.trim().toLowerCase();
    filteredServices = filteredServices.filter(
      (service) =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.category.toLowerCase().includes(searchTerm)
    );
  }

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderServices(currentPage);
    renderPagination();
  }
});

/* фильтрация по place */
const filterButtons = document.querySelectorAll(".filt-content button");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedPlace = btn.dataset.place;

    if (currentPlace === selectedPlace) {
      currentPlace = null;
      btn.classList.remove("active");
    } else {
      currentPlace = selectedPlace;
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    currentPage = 1;
    renderServices(currentPage);
    renderPagination();
  });
});

/* сортировка */
const sortSelect = document.querySelector("#sort");
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value || null; // если "", то null (отключаем сортировку)
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

/* поиск */
const searchInput = document.querySelector(".search-input input");
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

fetchServices();
/* */
