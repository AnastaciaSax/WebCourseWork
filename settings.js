document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  // === Theme, Lang, etc. ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") body.classList.add("dark-theme");

  const langIndex = localStorage.getItem("langIndex");
  if (langIndex !== null) {
    document.querySelectorAll('.lang-pick .checkbox input[type="checkbox"]').forEach((cb, i) => {
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
});