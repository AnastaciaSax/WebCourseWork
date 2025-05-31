//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
//options
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeSwitch = document.querySelector(
    '.theme-switch input[type="checkbox"]'
  );
  const resetButton = document.querySelector(".reset-but");
  const purblindCheckbox = document.querySelector(
    '.purblind .checkbox input[type="checkbox"]'
  );

  const updatePurblindDependentVisibility = () => {
    const isPurblindActive = purblindCheckbox.checked;
    const purblindSection = document.querySelector(".purblind-content");
    const imageSection = document.querySelector(".purblind-image");
    const typoSection = document.querySelector(".typo-container");

    [purblindSection, imageSection, typoSection].forEach((section) => {
      if (!section) return;

      section.style.opacity = isPurblindActive ? "1" : "0.3";

      const checkboxes = section.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb) => {
        cb.disabled = !isPurblindActive;
        if (!isPurblindActive) cb.checked = false; // снимаем чекбоксы
      });
    });

    // При отключении purblind удаляем связанные настройки из localStorage
    if (!isPurblindActive) {
      localStorage.removeItem("colorScheme");
      localStorage.removeItem("typoStyle");

      // Также можно убрать визуальное выделение блоков
      const colorBlocks = document.querySelectorAll(
        ".color-scheme-color .color-section-field"
      );
      const typoBlocks = document.querySelectorAll(
        ".typo-content > .typo-content"
      );
      colorBlocks.forEach((b) => b.classList.remove("active"));
      typoBlocks.forEach((b) => b.classList.remove("active"));
    }
  };

  // --- Тема ---
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    if (themeSwitch) themeSwitch.checked = true;
  }

  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const newTheme = themeSwitch.checked ? "dark" : "light";
      body.classList.toggle("dark-theme", themeSwitch.checked);
      localStorage.setItem("theme", newTheme);
    });
  }

  // --- Язык ---
  const langCheckboxes = document.querySelectorAll(
    '.lang-pick .checkbox input[type="checkbox"]'
  );
  langCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      langCheckboxes.forEach((cb, i) => (cb.checked = i === index));
      localStorage.setItem("langIndex", index.toString());
    });
  });

  // Восстановление выбранного языка
  const savedLangIndex = localStorage.getItem("langIndex");
  if (savedLangIndex !== null) {
    langCheckboxes.forEach(
      (cb, i) => (cb.checked = i === parseInt(savedLangIndex))
    );
  }

  // --- Purblind ---
  const savedPurblind = localStorage.getItem("purblind") === "true";
  purblindCheckbox.checked = savedPurblind;
  updatePurblindDependentVisibility();

  purblindCheckbox.addEventListener("change", () => {
    localStorage.setItem("purblind", purblindCheckbox.checked.toString());
    updatePurblindDependentVisibility();
  });

  // --- Универсальный обработчик выделения для группы чекбоксов ---
  const handleExclusiveSelection = (checkboxes, blocks, groupKey) => {
    const savedIndex = localStorage.getItem(groupKey);
    if (savedIndex !== null && checkboxes[savedIndex]) {
      checkboxes[savedIndex].checked = true;
      blocks.forEach((block, i) => {
        block.classList.toggle("active", i === parseInt(savedIndex));
      });
    }

    checkboxes.forEach((checkbox, index) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          checkboxes.forEach((cb, i) => (cb.checked = i === index));
          blocks.forEach((block, i) => {
            block.classList.toggle("active", i === index);
          });
          localStorage.setItem(groupKey, index.toString());
        } else {
          const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
          if (!anyChecked) {
            blocks.forEach((block) => block.classList.remove("active"));
            localStorage.removeItem(groupKey);
          }
        }
      });
    });
  };

  // --- Color Scheme ---
  const colorCheckboxes = document.querySelectorAll(
    '.color-scheme-color-pick .checkbox input[type="checkbox"]'
  );
  const colorBlocks = document.querySelectorAll(
    ".color-scheme-color .color-section-field"
  );
  handleExclusiveSelection(colorCheckboxes, colorBlocks, "colorScheme");

  // --- Typography ---
  const typoCheckboxes = document.querySelectorAll(
    '.typo-pick .checkbox input[type="checkbox"]'
  );
  const typoBlocks = document.querySelectorAll(".typo-content > .typo-content");
  handleExclusiveSelection(typoCheckboxes, typoBlocks, "typoStyle");

  // --- Reset ---
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      if (themeSwitch) themeSwitch.checked = false;

      if (langCheckboxes.length >= 2) {
        langCheckboxes[0].checked = true;
        langCheckboxes[1].checked = false;
        localStorage.setItem("langIndex", "0");
      }

      const allCheckboxes = document.querySelectorAll(
        '.checkbox input[type="checkbox"]'
      );
      allCheckboxes.forEach((cb) => {
        const isTheme = cb === themeSwitch;
        const isLang = cb.closest(".lang-pick");
        if (!isTheme && !isLang) cb.checked = false;
      });

      purblindCheckbox.checked = false;
      localStorage.setItem("purblind", "false");
      updatePurblindDependentVisibility();

      // Сбросить выделения
      colorBlocks.forEach((b) => b.classList.remove("active"));
      typoBlocks.forEach((b) => b.classList.remove("active"));
      localStorage.removeItem("colorScheme");
      localStorage.removeItem("typoStyle");
    });
  }
});
