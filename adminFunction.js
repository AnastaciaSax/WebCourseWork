const serviceContainer = document.getElementById("admin-service-list");
const paginationContainer = document.querySelector(".page");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");

let currentPage = 1;
const servicesPerPage = 4;
let services = [];
let currentPlace = null;
let currentSort = null;
let currentSearch = "";

// Элементы модалок
const editModal = document.getElementById("edit-modal");
const deleteModal = document.getElementById("delete-modal");
const editForm = document.getElementById("edit-form");
const cancelEditBtn = document.getElementById("cancel-edit");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelDeleteBtn = document.getElementById("cancel-delete");

const newServiceModal = document.getElementById("new-service-modal");
const newServiceForm = document.getElementById("new-service-form");
const cancelNewBtn = document.getElementById("cancel-new");

let serviceToDeleteId = null;

// Загрузка всех сервисов
async function fetchServices() {
  try {
    const res = await fetch("http://localhost:3001/services");
    services = await res.json();
    renderPagination();
    renderServices(currentPage);
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

// Отображение сервисов
function renderServices(page) {
  serviceContainer.innerHTML = "";

  let filtered = [...services];

  if (currentPlace) {
    filtered = filtered.filter((s) => s.place === currentPlace);
  }

  if (currentSearch.trim()) {
    const term = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
    );
  }

  if (currentSort) {
    filtered.sort((a, b) =>
      currentSort === "price"
        ? a.price - b.price
        : a[currentSort].localeCompare(b[currentSort])
    );
  }

  const start = (page - 1) * servicesPerPage;
  const current = filtered.slice(start, start + servicesPerPage);

  if (filtered.length === 0) {
    serviceContainer.innerHTML = "<p>No services found.</p>";
    return;
  }

  current.forEach((service) => {
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
        <div class="admin-controls">
          <button class="edit-btn" data-id="${service.id}">
            <img src="./Assets/editBut.svg" alt="Edit"/>
          </button>
          <button class="delete-btn" data-id="${service.id}">
            <img src="./Assets/bin.svg" alt="Delete"/>
          </button>
        </div>
      </div>
    `;

    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => deleteService(service.id));

    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => editService(service));

    serviceContainer.appendChild(card);
  });
}

// Удаление с модалкой
function deleteService(id) {
  serviceToDeleteId = id;
  deleteModal.classList.remove("hidden");
}

// Подтверждение удаления
confirmDeleteBtn.addEventListener("click", async () => {
  try {
    await fetch(`http://localhost:3001/services/${serviceToDeleteId}`, {
      method: "DELETE",
    });
    deleteModal.classList.add("hidden");
    serviceToDeleteId = null;
    fetchServices();
  } catch (error) {
    console.error("Error deleting service:", error);
  }
});

// Отмена удаления
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  serviceToDeleteId = null;
});

// Редактирование
function editService(service) {
  editForm.id.value = service.id;
  editForm.title.value = service.title;
  editForm.category.value = service.category;
  editForm.place.value = service.place; // добавлено
  editForm.price.value = service.price;
  editForm.photoURL.value = service.photoURL;

  editModal.classList.remove("hidden");
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(editForm);
  const updated = Object.fromEntries(formData.entries());
  updated.price = Number(updated.price);
  updated.place = updated.place.trim();

  try {
    await fetch(`http://localhost:3001/services/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    editModal.classList.add("hidden");
    fetchServices();
  } catch (error) {
    console.error("Error updating service:", error);
  }
});

// Отмена редактирования
cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
});
// Открытие модалки
document.getElementById("add-service-btn").addEventListener("click", () => {
  newServiceModal.classList.remove("hidden");
});
// Отправка новой услуги
newServiceForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(newServiceForm);
  const newService = Object.fromEntries(formData.entries());
  newService.price = Number(newService.price);
  newService.place = newService.place.trim();

  try {
    await fetch("http://localhost:3001/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newService)
    });
    newServiceModal.classList.add("hidden");
    newServiceForm.reset();
    fetchServices();
  } catch (error) {
    console.error("Error adding new service:", error);
  }
});

// Отмена создания
cancelNewBtn.addEventListener("click", () => {
  newServiceModal.classList.add("hidden");
  newServiceForm.reset();
});

// Пагинация
function renderPagination() {
  paginationContainer.innerHTML = "";
  const filtered = services.filter((service) => {
    if (currentPlace && service.place !== currentPlace) return false;
    if (
      currentSearch &&
      !(
        service.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
        service.category.toLowerCase().includes(currentSearch.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / servicesPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i < 10 ? `0${i}` : i;
    btn.classList.add("page-button");
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderServices(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(btn);
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
  const filteredCount = services.filter((service) => {
    if (currentPlace && service.place !== currentPlace) return false;
    if (
      currentSearch &&
      !(
        service.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
        service.category.toLowerCase().includes(currentSearch.toLowerCase())
      )
    )
      return false;
    return true;
  }).length;

  const totalPages = Math.ceil(filteredCount / servicesPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderServices(currentPage);
    renderPagination();
  }
});

// Фильтрация
document.querySelectorAll(".filt-content button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.place;
    currentPlace = currentPlace === selected ? null : selected;

    document
      .querySelectorAll(".filt-content button")
      .forEach((b) => b.classList.remove("active"));
    if (currentPlace) btn.classList.add("active");

    currentPage = 1;
    renderServices(currentPage);
    renderPagination();
  });
});

// Сортировка
document.querySelector("#sort").addEventListener("change", (e) => {
  currentSort = e.target.value || null;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

// Поиск
document.querySelector(".search-input input").addEventListener("input", (e) => {
  currentSearch = e.target.value;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

// Кнопка добавления
document.getElementById("add-service-btn").addEventListener("click", () => {
});

fetchServices();

// burger menu
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
