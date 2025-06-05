document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  // === Theme, Lang, etc. ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark-theme");

  const langIndex = localStorage.getItem("langIndex");
  if (langIndex !== null) {
    document
      .querySelectorAll('.lang-pick .checkbox input[type="checkbox"]')
      .forEach((cb, i) => {
        cb.checked = i === parseInt(langIndex);
      });
  }

  // === Sign Out Logic ===
  const exitButton = document.getElementById("exit-button");
  const exitButtonMobile = document.getElementById("exit-button-mobile");
  const userId = localStorage.getItem("userId");
  const currentUser = localStorage.getItem("currentUser");

  if (userId && currentUser) {
    if (exitButton) exitButton.style.display = "flex";
    if (exitButtonMobile) exitButtonMobile.style.display = "flex";
  } else {
    if (exitButton) exitButton.style.display = "none";
    if (exitButtonMobile) exitButtonMobile.style.display = "none";
  }

  const handleExit = (e) => {
    e.preventDefault();
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");

    if (exitButton) exitButton.style.display = "none";
    if (exitButtonMobile) exitButtonMobile.style.display = "none";
  };

  if (exitButton) exitButton.addEventListener("click", handleExit);
  if (exitButtonMobile) exitButtonMobile.addEventListener("click", handleExit);

  let user = null;
  try {
    user = JSON.parse(currentUser);
  } catch {
    user = currentUser;
  }

  if (
    user &&
    (user === "admin" || user.role === "admin" || user.username === "admin")
  ) {
    // Header nav links
    document.querySelectorAll('nav a[href="catalog.html"]').forEach((link) => {
      link.setAttribute("href", "admin.html");
      link.dataset.i18n = "admin";
    });

    // Burger menu links
    document
      .querySelectorAll('.burger-menu a[href="catalog.html"]')
      .forEach((link) => {
        link.setAttribute("href", "admin.html");
        link.dataset.i18n = "admin";
      });

    // Footer links (без категории)
    document
      .querySelectorAll('footer a[href="catalog.html"]')
      .forEach((link) => {
        link.setAttribute("href", "admin.html");
        link.dataset.i18n = "admin";
      });
  }
  window.applyTranslations = function (langCode) {
    const langData = translations[langCode];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (langData[key]) el.textContent = langData[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (langData[key]) el.setAttribute("placeholder", langData[key]);
    });
  };

  const savedLangCode = localStorage.getItem("lang") || "en";
  applyTranslations(savedLangCode);

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.dataset.lang;
      localStorage.setItem("lang", selectedLang);
      applyTranslations(selectedLang);
    });
  });

  // // === Unified Purblind Settings ===
const purblindMode = localStorage.getItem("purblind") === "true";
const colorScheme = localStorage.getItem("colorScheme"); // "0", "1", "2"
const typoStyle = localStorage.getItem("typoStyle");     // "0", "1", "2"
const showImages = localStorage.getItem("showImages") === "true"; // true = показывать

if (purblindMode) {
    body.classList.add("purblind-mode");

    // Удаляем все purblind классы, чтобы потом добавить нужные
    body.classList.remove(
      "purblind-color-0", "purblind-color-1", "purblind-color-2",
      "purblind-typo-0", "purblind-typo-1", "purblind-typo-2",
      "purblind-hide-images"
    );

    if (colorScheme !== null) {
      body.classList.add(`purblind-color-${colorScheme}`);
    }

    if (typoStyle !== null) {
      body.classList.add(`purblind-typo-${typoStyle}`);
    }

    if (!showImages) {
      body.classList.add("purblind-hide-images");
    }
  } else {
    // Отключаем purblind
    body.classList.remove("purblind-mode");
    body.classList.remove(
      "purblind-color-0", "purblind-color-1", "purblind-color-2",
      "purblind-typo-0", "purblind-typo-1", "purblind-typo-2",
      "purblind-hide-images"
    );
  }

  // --- Работа с изображениями для purblind режима ---
  if (purblindMode && !showImages) {
    // Скрываем картинки, показываем alt-замены
    document.querySelectorAll("img").forEach((img) => {
      if (img.style.display === "none") return; // уже скрыт

      const altText = img.getAttribute("alt") || "Изображение скрыто";
      const replacement = document.createElement("div");
      replacement.className = "alt-replacement";
      replacement.textContent = altText;

      img.style.display = "none";
      img.insertAdjacentElement("beforebegin", replacement);
    });

    document.querySelectorAll("picture").forEach((pic) => {
      pic.style.display = "none";
    });
  } else {
    // Показываем все изображения, убираем alt-замены
    document.querySelectorAll(".alt-replacement").forEach((el) => el.remove());
    document.querySelectorAll("img").forEach((img) => {
      img.style.display = "";
    });
    document.querySelectorAll("picture").forEach((pic) => {
      pic.style.display = "";
    });
}
 // --- Отмечаем чекбоксы в options странице (если там есть элементы) ---
  const colorCheckboxes = document.querySelectorAll('.color-scheme-color-pick .checkbox input[type="checkbox"]');
  const colorBlocks = document.querySelectorAll('.color-scheme-color .color-section-field');

  const typoCheckboxes = document.querySelectorAll('.typo-pick .checkbox input[type="checkbox"]');
  const typoBlocks = document.querySelectorAll('.typo-content > .typo-content');

  if (colorCheckboxes.length && colorBlocks.length && colorScheme !== null) {
    colorCheckboxes.forEach((cb, i) => {
      cb.checked = i === parseInt(colorScheme);
      colorBlocks[i].classList.toggle("active", i === parseInt(colorScheme));
    });
  }

  if (typoCheckboxes.length && typoBlocks.length && typoStyle !== null) {
    typoCheckboxes.forEach((cb, i) => {
      cb.checked = i === parseInt(typoStyle);
      typoBlocks[i].classList.toggle("active", i === parseInt(typoStyle));
    });
  }
});
