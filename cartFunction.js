const cartContainer = document.querySelector(".cart-card");
const paginationContainer = document.querySelector(".page");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");

const serviceCountElem = document.querySelector(".service-num span");
const totalPriceElem = document.querySelector(".price-num span");

let cartItems = [];
let services = [];
let currentPage = 1;
const itemsPerPage = 4;

/* 🔐 Check Authorization */
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("You need to sign in to access your cart.");
  window.location.href = "signIn.html";
} else {
  fetchData(); // only if authorized
}

/* fetch cart */
async function fetchData() {
  try {
    const [cartRes, serviceRes] = await Promise.all([
      fetch("http://localhost:3001/cart"),
      fetch("http://localhost:3001/services"),
    ]);

    const cartData = await cartRes.json();
    services = await serviceRes.json();

    // only for this user
    cartItems = cartData.filter((item) => item.userId == userId);
    renderPagination();
    renderCart(currentPage);
    updateSummary();
  } catch (error) {
    console.error("Loading data ERROR:", error);
  }
}

function renderCart(page) {
  cartContainer.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentCartItems = cartItems.slice(start, end);

  if (currentCartItems.length === 0) {
    const empty = document.createElement("div");
    empty.classList.add("not-found-message");
    empty.textContent =
      "Your cart is empty. Go ahead & fill it in our Design Catalog! :)";
    cartContainer.appendChild(empty);
    return;
  }

  currentCartItems.forEach((item) => {
    const service = services.find((s) => s.id == item.serviceId);
    if (!service) return;

    const card = document.createElement("div");
    card.classList.add("cart-item");
    card.innerHTML = `
      <div class="cart-pic">
        <img src="${service.photoURL}" alt="${service.title}">
      </div>
      <div class="cart-info">
        <div class="cart-title">
          <h3>${service.title}</h3>
          <p>${service.category}</p>
        </div>
        <p class="cart-price">$ ${service.price}</p>
        <button class="remove-from-cart" data-id="${item.id}">
          <img src="./Assets/bin.svg" alt="Delete">
        </button>
      </div>
    `;
    cartContainer.appendChild(card);
  });

  // 1st & last for CSS
  const items = document.querySelectorAll(".cart-item");
  items.forEach((item) => item.classList.remove("first", "last"));
  if (items.length > 0) items[0].classList.add("first");
  if (items.length > 1) items[items.length - 1].classList.add("last");

  // Delete
  document.querySelectorAll(".remove-from-cart").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`http://localhost:3001/cart/${id}`, { method: "DELETE" });
      cartItems = cartItems.filter((item) => item.id != id);
      renderPagination();
      renderCart(currentPage);
      updateSummary();
    });
  });
}

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i < 10 ? `0${i}` : i;
    pageBtn.classList.add("page-button");
    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderCart(currentPage);
      renderPagination();
    });

    paginationContainer.appendChild(pageBtn);
  }
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCart(currentPage);
    renderPagination();
  }
});

nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCart(currentPage);
    renderPagination();
  }
});

function updateSummary() {
  const total = cartItems.reduce((sum, item) => {
    const service = services.find((s) => s.id == item.serviceId);
    return sum + (service ? service.price : 0);
  }, 0);

  serviceCountElem.textContent = `Services: ${cartItems.length}`;
  totalPriceElem.textContent = `Total: $ ${total}`;
}
const signOutBtn = document.querySelector(".exit-button");

if (signOutBtn) {
  signOutBtn.addEventListener("click", () => {
    // Очистка данных авторизации, если это не делает общий скрипт (иначе можно убрать)
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");

    alert("You need to sign in to access your cart.");
    window.location.href = "signIn.html";
  });
}

//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
