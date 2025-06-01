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

const cartButton = document.querySelector(".cart-butt a");
const userId = localStorage.getItem("userId");

async function fetchCartCount(userId) {
  if (!userId) return 0;

  try {
    const res = await fetch(`http://localhost:3001/cart?userId=${userId}`);
    const cartItems = await res.json();
    return cartItems.length;
  } catch (error) {
    console.error("Error loading cart data:", error);
    return 0;
  }
}

async function updateCartCount() {
  const count = await fetchCartCount(userId);

  let oldCountSpan = cartButton.querySelector(".cart-count");
  if (oldCountSpan) oldCountSpan.remove();

  if (count > 0) {
    const countSpan = document.createElement("span");
    countSpan.classList.add("cart-count");
    countSpan.textContent = count;
    cartButton.appendChild(countSpan);
  }
}

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

  const start = (page - 1) * servicesPerPage;
  const end = start + servicesPerPage;
  const currentServices = filteredServices.slice(start, end);

  if (filteredServices.length === 0) {
    const notFound = document.createElement("div");
    notFound.classList.add("not-found-message");
    notFound.textContent =
      "Sorry, no services found for what you're looking for.";
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

    const addToCartButton = card.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", async () => {
  if (!userId) {
    alert("Please sign in to add services to your cart.");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3001/cart?userId=${userId}&serviceId=${service.id}`
    );
    const existingItems = await res.json();

    if (existingItems.length > 0) {
      alert("This service is already in your cart.");
      return;
    }

    await fetch("http://localhost:3001/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        serviceId: service.id,
        title: service.title,
        price: service.price,
        category: service.category,
        photoURL: service.photoURL
      })
    });

    updateCartCount();
    alert("Service added to cart!");
  } catch (error) {
    console.error("Failed to add service to cart:", error);
  }
});

    serviceContainer.appendChild(card);
  });

  const items = document.querySelectorAll(".service-item");
  items.forEach((item) => item.classList.remove("first", "last"));
  if (items.length > 0) items[0].classList.add("first");
  if (items.length > 1) items[items.length - 1].classList.add("last");
}

function renderPagination() {
  paginationContainer.innerHTML = "";

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

const sortSelect = document.querySelector("#sort");
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value || null;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

const searchInput = document.querySelector(".search-input input");
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

fetchServices();
updateCartCount();

// burger menu
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// автоприменение фильтра через URL
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (category) {
    applyCategoryFilter(category);
  }
});

function applyCategoryFilter(category) {
  const buttons = document.querySelectorAll(".filt-content button");

  buttons.forEach((btn) => {
    if (btn.dataset.place === category) {
      btn.classList.add("active");
      btn.click();
    } else {
      btn.classList.remove("active");
    }
  });
}