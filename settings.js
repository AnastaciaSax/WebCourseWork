document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // --- Theme ---
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }

  // --- Language ---
  const langIndex = localStorage.getItem("langIndex");
  if (langIndex !== null) {
    const langCheckboxes = document.querySelectorAll('.lang-pick .checkbox input[type="checkbox"]');
    langCheckboxes.forEach((cb, i) => (cb.checked = i === parseInt(langIndex)));
  }

  // --- Purblind Mode ---
  const isPurblind = localStorage.getItem("purblind") === "true";
  if (isPurblind) {
    const purblindCheckbox = document.querySelector('.purblind .checkbox input[type="checkbox"]');
    if (purblindCheckbox) purblindCheckbox.checked = true;

    const purblindSection = document.querySelector(".purblind-content");
    const imageSection = document.querySelector(".purblind-image");
    const typoSection = document.querySelector(".typo-container");

    [purblindSection, imageSection, typoSection].forEach((section) => {
      if (!section) return;
      section.style.opacity = "1";

      const checkboxes = section.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb) => {
        cb.disabled = false;
      });
    });

    // --- Typography ---
    const typoIndex = parseInt(localStorage.getItem("typoStyle"));
    const typoCheckboxes = document.querySelectorAll('.typo-pick .checkbox input[type="checkbox"]');
    const typoBlocks = document.querySelectorAll(".typo-content > .typo-content");
    if (!isNaN(typoIndex) && typoCheckboxes[typoIndex]) {
      typoCheckboxes[typoIndex].checked = true;
      typoBlocks.forEach((block, i) =>
        block.classList.toggle("active", i === typoIndex)
      );
    }

    // --- Color Scheme ---
    const colorIndex = parseInt(localStorage.getItem("colorScheme"));
    const colorCheckboxes = document.querySelectorAll('.color-scheme-color-pick .checkbox input[type="checkbox"]');
    const colorBlocks = document.querySelectorAll('.color-scheme-color .color-section-field');
    if (!isNaN(colorIndex) && colorCheckboxes[colorIndex]) {
      colorCheckboxes[colorIndex].checked = true;
      colorBlocks.forEach((block, i) =>
        block.classList.toggle("active", i === colorIndex)
      );
    }
  }
});