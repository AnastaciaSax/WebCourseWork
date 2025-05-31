//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// sign in valid
document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("signin-name");
  const emailInput = document.getElementById("signin-email");
  const passwordInput = document.getElementById("signin-password");
  const signInButton = document.querySelector(".down-but");
  let attemptedSubmit = false;

  const inputs = [nameInput, emailInput, passwordInput];

  function showError(input, message) {
    input.classList.add("input-error-field");

    const wrapper = input.closest(".field-wrapper");
    if (wrapper.querySelector(".input-error")) {
      wrapper.querySelector(".input-error").remove();
    }

    const error = document.createElement("div");
    error.classList.add("input-error");
    error.textContent = message;
    wrapper.appendChild(error);
  }

  function clearError(input) {
    input.classList.remove("input-error-field");

    const wrapper = input.closest(".field-wrapper");
    const oldError = wrapper.querySelector(".input-error");
    if (oldError) oldError.remove();
  }

  function validateName(value) {
    if (!/^[A-ZА-Я][a-zа-яё]+$/.test(value)) {
      return "Starts with an upper case letter and contains only letters";
    }
    return "";
  }

  function validateEmail(value) {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return "Invalid email address";
    }
    return "";
  }

  function validateAll() {
    const nameError = validateName(nameInput.value.trim());
    const emailError = validateEmail(emailInput.value.trim());

    if (attemptedSubmit) {
      nameError ? showError(nameInput, nameError) : clearError(nameInput);
      emailError ? showError(emailInput, emailError) : clearError(emailInput);
    }

    return !nameError && !emailError;
  }

  function validateSingle(input) {
    const value = input.value.trim();
    let error = "";

    if (input === nameInput) {
      error = validateName(value);
    } else if (input === emailInput) {
      error = validateEmail(value);
    }

    if (error) {
      showError(input, error);
    } else {
      clearError(input);
    }
  }

  async function checkUserByName(name) {
    try {
      const response = await fetch(
        `http://localhost:3001/users?name=${encodeURIComponent(name)}`
      );
      const users = await response.json();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      alert("Failed to connect to server.");
      return null;
    }
  }

  signInButton.addEventListener("click", async (e) => {
    attemptedSubmit = true;

    if (validateAll()) {
      const name = nameInput.value.trim();
      const password = passwordInput.value;

      const user = await checkUserByName(name);

      clearError(nameInput);
      clearError(passwordInput);

      if (!user) {
        showError(nameInput, "No user found");
      } else if (user.password !== password) {
        showError(passwordInput, "Incorrect password");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "home.html";
      }
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!attemptedSubmit) return;
      validateSingle(input);
    });
  });
});