/* pagin */
const serviceContainer = document.querySelector(".service-card");
const paginationContainer = document.querySelector(".page");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");

let currentPage = 1;
const servicesPerPage = 4;
let services = [];

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

  const start = (page - 1) * servicesPerPage;
  const end = start + servicesPerPage;
  const currentServices = services.slice(start, end);

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

  const items = document.querySelectorAll(".service-item");
items.forEach((item) => item.classList.remove("first", "last")); // очистка

if (items.length > 0) items[0].classList.add("first");
if (items.length > 1) items[items.length - 1].classList.add("last");
}

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(services.length / servicesPerPage);

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
  const totalPages = Math.ceil(services.length / servicesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderServices(currentPage);
    renderPagination();
  }
});

fetchServices();
/* */
