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

  const colorCheckboxes = document.querySelectorAll(
    '.color-scheme-color-pick .checkbox input[type="checkbox"]'
  );
  const colorBlocks = document.querySelectorAll(
    ".color-scheme-color .color-section-field"
  );

  const typoCheckboxes = document.querySelectorAll(
    '.typo-pick .checkbox input[type="checkbox"]'
  );
  const typoBlocks = document.querySelectorAll(".typo-content > .typo-content");

  const langCheckboxes = document.querySelectorAll(
    '.lang-pick .checkbox input[type="checkbox"]'
  );
  const imageCheckbox = document.querySelector(
    '.purblind-image .checkbox input[type="checkbox"]'
  );

  const applyPurblindStyles = () => {
    // Сначала удалить все старые классы
    body.classList.remove(
      "purblind-color-0",
      "purblind-color-1",
      "purblind-color-2",
      "purblind-typo-0",
      "purblind-typo-1",
      "purblind-typo-2",
      "purblind-hide-images"
    );

    if (!purblindCheckbox.checked) return;

    const colorIndex = localStorage.getItem("colorScheme");
    const typoIndex = localStorage.getItem("typoStyle");
    const showImages = localStorage.getItem("showImages") === "true";

    if (colorIndex !== null) {
      body.classList.add(`purblind-color-${colorIndex}`);
    }

    if (typoIndex !== null) {
      body.classList.add(`purblind-typo-${typoIndex}`);
    }

    if (!showImages) {
      body.classList.add("purblind-hide-images");
    }
  };

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
        if (!isPurblindActive) cb.checked = false;
      });
    });

    if (isPurblindActive) {
      // --- Image Checkbox ---
      const savedShowImages = localStorage.getItem("showImages");
      if (savedShowImages !== null) {
        imageCheckbox.checked = savedShowImages === "true";
      } else {
        imageCheckbox.checked = true; // по умолчанию включено
        localStorage.setItem("showImages", "true");
      }
      // --- Typography ---
      let savedTypoIndex = localStorage.getItem("typoStyle");
      if (savedTypoIndex !== null && typoCheckboxes[savedTypoIndex]) {
        typoCheckboxes.forEach((cb, i) => {
          cb.checked = i === parseInt(savedTypoIndex);
          typoBlocks[i].classList.toggle(
            "active",
            i === parseInt(savedTypoIndex)
          );
        });
      } else {
        const defaultIndex = 1;
        typoCheckboxes[defaultIndex].checked = true;
        localStorage.setItem("typoStyle", defaultIndex.toString());
        typoBlocks.forEach((block, i) =>
          block.classList.toggle("active", i === defaultIndex)
        );
      }

      // --- Color Scheme ---
      let savedColorIndex = localStorage.getItem("colorScheme");
      if (savedColorIndex !== null && colorCheckboxes[savedColorIndex]) {
        colorCheckboxes.forEach((cb, i) => {
          cb.checked = i === parseInt(savedColorIndex);
          colorBlocks[i].classList.toggle(
            "active",
            i === parseInt(savedColorIndex)
          );
        });
      } else {
        const defaultIndex = 0;
        colorCheckboxes[defaultIndex].checked = true;
        localStorage.setItem("colorScheme", defaultIndex.toString());
        colorBlocks.forEach((block, i) =>
          block.classList.toggle("active", i === defaultIndex)
        );
      }
    } else {
      localStorage.removeItem("colorScheme");
      localStorage.removeItem("typoStyle");

      colorBlocks.forEach((b) => b.classList.remove("active"));
      typoBlocks.forEach((b) => b.classList.remove("active"));

      imageCheckbox.checked = false;
      localStorage.removeItem("showImages");
    }
  };

  // --- Theme ---
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

  // --- Language ---
  const savedLangIndex = localStorage.getItem("langIndex");
  if (savedLangIndex !== null) {
    langCheckboxes.forEach(
      (cb, i) => (cb.checked = i === parseInt(savedLangIndex))
    );
  } else if (langCheckboxes.length > 0) {
    langCheckboxes[0].checked = true;
    localStorage.setItem("langIndex", "0");
  }

  langCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        langCheckboxes.forEach((cb, i) => (cb.checked = i === index));
        localStorage.setItem("langIndex", index.toString());

        const langCode = index === 1 ? "de" : "en"; // 0 — en, 1 — de
        localStorage.setItem("lang", langCode);
        applyTranslations(langCode);
      } else {
        const checkedCount = Array.from(langCheckboxes).filter(
          (cb) => cb.checked
        ).length;
        if (checkedCount === 0) checkbox.checked = true;
      }
    });
  });

  // --- Purblind Mode ---
  const savedPurblind = localStorage.getItem("purblind") === "true";
  purblindCheckbox.checked = savedPurblind;
  updatePurblindDependentVisibility();
  applyPurblindStyles();

  purblindCheckbox.addEventListener("change", () => {
    localStorage.setItem("purblind", purblindCheckbox.checked.toString());
    updatePurblindDependentVisibility();
    applyPurblindStyles();

    // Добавить сюда логику очистки/восстановления alt-замен и изображений
  if (!purblindCheckbox.checked) {
    // Восстанавливаем все изображения и удаляем alt-замены
    document.querySelectorAll(".alt-replacement").forEach((el) => el.remove());
    document.querySelectorAll("img").forEach((img) => {
      img.style.display = "";
    });
    document.querySelectorAll("picture").forEach((pic) => {
      pic.style.display = "";
    });
  } else {
    // Если включили purblind, проверяем состояние showImages и при необходимости создаём alt-замены
    const showImages = localStorage.getItem("showImages") === "true";
    if (!showImages) {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        if (img.style.display === "none") return;
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
    }
  }
  });

  // --- Универсальный обработчик чекбоксов ---
const handleExclusiveSelection = (checkboxes, blocks, groupKey) => {
  const savedIndex = localStorage.getItem(groupKey);
  if (savedIndex !== null && checkboxes[savedIndex]) {
    checkboxes[savedIndex].checked = true;
    blocks.forEach((block, i) =>
      block.classList.toggle("active", i === parseInt(savedIndex))
    );
  }

  checkboxes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        checkboxes.forEach((cb, i) => (cb.checked = i === index));
        blocks.forEach((block, i) =>
          block.classList.toggle("active", i === index)
        );
        localStorage.setItem(groupKey, index.toString());

        // Вот здесь добавляем:
        applyPurblindStyles();
        updatePurblindDependentVisibility();
      } else {
        const anyChecked = Array.from(checkboxes).some((cb) => cb.checked);
        if (!anyChecked) {
          checkbox.checked = true; // запрещаем отжатие последней
        }
      }
    });
  });
};

  handleExclusiveSelection(colorCheckboxes, colorBlocks, "colorScheme");
  handleExclusiveSelection(typoCheckboxes, typoBlocks, "typoStyle");

  if (imageCheckbox) {
    imageCheckbox.addEventListener("change", () => {
      const show = imageCheckbox.checked;
      localStorage.setItem("showImages", show.toString());
      applyPurblindStyles();

      // --- Добавляем alt-замену, если изображения отключены ---
      if (!show && purblindCheckbox.checked) {
        const images = document.querySelectorAll("img");
        images.forEach((img) => {
          if (img.style.display === "none") return; // уже обработан

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
        // Если включили изображения обратно — восстанавливаем
        document
          .querySelectorAll(".alt-replacement")
          .forEach((el) => el.remove());
        document.querySelectorAll("img").forEach((img) => {
          img.style.display = "";
        });
        document.querySelectorAll("picture").forEach((pic) => {
          pic.style.display = "";
        });
      }
    });
  }

  // --- Reset ---
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
      if (themeSwitch) themeSwitch.checked = false;

      // Язык: выставить первый
      if (langCheckboxes.length >= 1) {
        langCheckboxes.forEach((cb, i) => (cb.checked = i === 0));
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
      applyPurblindStyles();

      colorBlocks.forEach((b) => b.classList.remove("active"));
      typoBlocks.forEach((b) => b.classList.remove("active"));
      localStorage.removeItem("colorScheme");
      localStorage.removeItem("typoStyle");
    });
  }
});
