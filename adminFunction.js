const serviceContainer = document.getElementById("admin-service-list");
const paginationContainer = document.querySelector(".page");
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");

// Модалки и формы
const editModal = document.getElementById("edit-modal");
const deleteModal = document.getElementById("delete-modal");
const newServiceModal = document.getElementById("new-service-modal");

const editForm = document.getElementById("edit-form");
const newServiceForm = document.getElementById("new-service-form");

const cancelEditBtn = document.getElementById("cancel-edit");
const cancelDeleteBtn = document.getElementById("cancel-delete");
const confirmDeleteBtn = document.getElementById("confirm-delete");
const cancelNewBtn = document.getElementById("cancel-new");

let currentPage = 1;
const servicesPerPage = 4;

let services = [];
let currentPlace = null;
let currentSort = null;
let currentSearch = "";

let serviceToDeleteId = null;

// --- Утилиты ---

function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Валидация формы (с асинхронной проверкой картинки)
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll("input, select");
  const promises = [];

  fields.forEach((field) => {
    const wrapper = field.closest(".field-wrapper");
    if (!wrapper) return;

    let errorElem = Array.from(wrapper.children).find((child) =>
      child.classList?.contains("input-error")
    );

    if (!errorElem) return;

    field.classList.remove("input-error-field");
    errorElem.textContent = "";

    const name = field.name;
    const value = field.value.trim();

    if (!value) {
      errorElem.textContent = "This field is required";
      field.classList.add("input-error-field");
      isValid = false;
    } else if (name === "price" && (+value <= 0 || isNaN(+value))) {
      errorElem.textContent = "Price must be greater than 0";
      field.classList.add("input-error-field");
      isValid = false;
    } else if (name === "photoURL") {
      if (!value.startsWith("./Assets/")) {
        errorElem.textContent = 'Must start with "./Assets/"';
        field.classList.add("input-error-field");
        isValid = false;
      } else {
        const imgCheck = new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => {
            errorElem.textContent = "Image not found at specified path";
            field.classList.add("input-error-field");
            resolve(false);
          };
          img.src = value;
        });
        promises.push(imgCheck);
      }
    }
  });

  if (promises.length > 0) {
    return Promise.all(promises).then((results) => {
      return isValid && results.every(Boolean);
    });
  }

  return Promise.resolve(isValid);
}

// --- Фильтрация, сортировка ---

function getFilteredServices() {
  let filtered = [...services];

  if (currentPlace) {
    filtered = filtered.filter((s) => s.place === currentPlace);
  }

  if (currentSearch.trim() !== "") {
    const term = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
    );
  }

  if (currentSort) {
    filtered.sort((a, b) => {
      if (currentSort === "price") return a.price - b.price;
      else return a[currentSort].localeCompare(b[currentSort]);
    });
  }

  return filtered;
}

// --- Рендеринг услуг и пагинации ---

function renderServices(page) {
  serviceContainer.innerHTML = "";
  const filtered = getFilteredServices();

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

    card.querySelector(".delete-btn").addEventListener("click", () => deleteService(service.id));
    card.querySelector(".edit-btn").addEventListener("click", () => editService(service));

    serviceContainer.appendChild(card);
  });
        if (typeof window.handleImageReplacement === "function") {
  window.handleImageReplacement();
    }
}

function renderPagination() {
  paginationContainer.innerHTML = "";
  const filtered = getFilteredServices();
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

// --- CRUD ---

function deleteService(id) {
  serviceToDeleteId = id;
  deleteModal.classList.remove("hidden");
}

confirmDeleteBtn.addEventListener("click", async () => {
  try {
    await fetch(`http://localhost:3001/services/${serviceToDeleteId}`, {
      method: "DELETE",
    });
    deleteModal.classList.add("hidden");
    serviceToDeleteId = null;
    await fetchServices();
  } catch (error) {
    console.error(error);
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  serviceToDeleteId = null;
});

function editService(service) {
  editForm.elements["id"].value = service.id;
  editForm.elements["title"].value = service.title;
  editForm.elements["category"].value = service.category;
  editForm.elements["place"].value = service.place;
  editForm.elements["price"].value = service.price;
  editForm.elements["photoURL"].value = service.photoURL;

  editModal.classList.remove("hidden");
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isValid = await validateForm(editForm);
  if (!isValid) return;

  const formData = new FormData(editForm);
  const updated = Object.fromEntries(formData.entries());

  updated.title = capitalizeWords(updated.title.trim());
  updated.category = capitalizeWords(updated.category.trim());
  updated.price = Number(updated.price);
  updated.place = updated.place.trim();

  try {
    const response = await fetch(`http://localhost:3001/services/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!response.ok) throw new Error("Update failed");

    editModal.classList.add("hidden");
    await fetchServices();
  } catch (error) {
    console.error(error);
  }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

document.getElementById("add-service-btn").addEventListener("click", () => {
  newServiceModal.classList.remove("hidden");
});

newServiceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isValid = await validateForm(newServiceForm);
  if (!isValid) return;

  const formData = new FormData(newServiceForm);
  const newService = Object.fromEntries(formData.entries());

  newService.title = capitalizeWords(newService.title.trim());
  newService.category = capitalizeWords(newService.category.trim());
  newService.price = Number(newService.price);
  newService.place = newService.place.trim();

  try {
    const response = await fetch("http://localhost:3001/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newService),
    });

    if (!response.ok) throw new Error("Create failed");

    newServiceModal.classList.add("hidden");
    newServiceForm.reset();
    await fetchServices();
  } catch (error) {
    console.error(error);
  }
});

cancelNewBtn.addEventListener("click", () => {
  newServiceModal.classList.add("hidden");
  newServiceForm.reset();
});

// --- Пагинация кнопки ---

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderServices(currentPage);
    renderPagination();
  }
});

nextButton.addEventListener("click", () => {
  const filtered = getFilteredServices();
  const totalPages = Math.ceil(filtered.length / servicesPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderServices(currentPage);
    renderPagination();
  }
});

// --- Фильтры и поиск ---

document.getElementById("search-input")?.addEventListener("input", (e) => {
  currentSearch = e.target.value.trim();
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

// Фильтр по кнопкам выбора места (если есть)
document.querySelectorAll(".filt-content button").forEach((button) => {
  button.addEventListener("click", () => {
    const isActive = button.classList.contains("active");

    document.querySelectorAll(".filt-content button").forEach((btn) =>
      btn.classList.remove("active")
    );

    if (isActive) {
      currentPlace = null;
    } else {
      button.classList.add("active");
      currentPlace = button.dataset.place;
    }

    currentPage = 1;
    renderServices(currentPage);
    renderPagination();
  });
});

// Сортировка
document.getElementById("sort")?.addEventListener("change", (e) => {
  currentSort = e.target.value || null;
  currentPage = 1;
  renderServices(currentPage);
  renderPagination();
});

// --- Загрузка данных с сервера ---
async function fetchServices() {
  try {
    const res = await fetch("http://localhost:3001/services");
    services = await res.json();
    renderPagination();
    renderServices(currentPage);
  } catch (error) {
    console.error(error);
  }
}

// --- Инициализация ---
fetchServices();


// burger menu
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
