//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("active");
});
// check valid
document.addEventListener("DOMContentLoaded", () => {
  // Сбрасываем авторизацию при заходе на страницу регистрации
  localStorage.removeItem("userId");
  localStorage.removeItem("currentUser");

  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const birthInput = document.getElementById("birthdate");
  const nicknameInput = document.getElementById("nickname");
  const passwordInput = document.getElementById("password");
  const repeatPasswordInput = document.getElementById("repeatPassword");
  const autoPasswordCheckbox = document.getElementById("autoGeneratePassword");
  const generateNickBtn = document.getElementById("generateNickname");
  const registerBtn = document.querySelector(".create-account");
  const inputs = document.querySelectorAll("input[required]");
  const modal = document.getElementById("termsModal");
  const agreeCheckbox = document.getElementById("agreeTerms");
  const confirmBtn = document.getElementById("confirmRegister");
  const cancelBtn = document.getElementById("cancelModal");
  let nickTries = 0;
  let newUser = null;

  const topPasswords = new Set([
    "123456", "password", "123456789", "12345678", "12345", "qwerty", "abc123", "password1",
    "1234567", "123123", "admin", "letmein", "welcome", "monkey", "1234", "1q2w3e4r", "123",
    "111111", "qwerty123", "iloveyou", "password123", "000000", "zxcvbnm", "asdfghjkl", "sunshine",
    "121212", "dragon", "princess", "qwertyuiop", "987654321", "football", "baseball", "starwars",
    "123qwe", "shadow", "superman", "696969", "qazwsx", "michael", "football1", "159753", "batman",
    "access", "master", "jessica", "7777777", "hunter", "123abc", "andrew", "tigger", "test",
    "thomas", "love", "soccer", "computer", "whatever", "harley", "buster", "george", "222222",
    "jordan", "ashley", "fuckyou", "baseball1", "666666", "charlie", "robert", "pepper", "maggie",
    "cookie", "dakota", "mickey", "232323", "summer", "snoopy", "ginger", "joseph", "chelsea",
    "orange", "maverick", "nicole", "daniel", "babygirl", "lovely", "jasmine", "brandon", "112233",
    "anthony", "peanut", "bubbles", "angel", "william", "cricket", "hello", "scooby", "rainbow",
    "102030", "justin", "flower", "fish", "cheese", "amanda", "michelle"
  ]);

  const showError = (input, message) => {
    removeError(input);
    input.classList.add("input-error-field");
    const error = document.createElement("div");
    error.className = "input-error";
    error.textContent = message;
    const wrapper = input.closest(".field-wrapper");
    if (wrapper) {
      wrapper.appendChild(error);
    } else {
      input.insertAdjacentElement("afterend", error);
    }
  };

  const removeError = (input) => {
    input.classList.remove("input-error-field");
    const wrapper = input.closest(".field-wrapper");
    if (wrapper) {
      const error = wrapper.querySelector(".input-error");
      if (error) error.remove();
    }
  };

  const removeAllErrors = () => {
    inputs.forEach(removeError);
  };

  const validateName = (input) => {
    const value = input.value.trim();
    if (!value || value[0] !== value[0].toUpperCase()) {
      showError(input, "Upper case");
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();
    const pattern = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (!pattern.test(value)) {
      showError(emailInput, "Incorrect email");
      return false;
    }
    return true;
  };

  const validatePhone = () => {
    const value = phoneInput.value.trim();
    const pattern = /^\+375\d{9}$/;
    if (!pattern.test(value)) {
      showError(phoneInput, "Format +375XXXXXXXXX");
      return false;
    }
    return true;
  };

  const validateBirth = () => {
    const value = birthInput.value.trim();
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    if (
      isNaN(date) ||
      age < 16 ||
      (age === 16 && now < new Date(date.setFullYear(date.getFullYear() + 16)))
    ) {
      showError(birthInput, "You're not 16");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const value = passwordInput.value;
    if (autoPasswordCheckbox.checked) return true;

    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
    if (!pattern.test(value)) {
      showError(
        passwordInput,
        "8–20 chars, a lower & upper case letter, digit & symbol"
      );
      return false;
    }
    if (topPasswords.has(value.toLowerCase())) {
      showError(passwordInput, "Too popular");
      return false;
    }
    if (value !== repeatPasswordInput.value) {
      showError(repeatPasswordInput, "Doesn't match");
      return false;
    }
    return true;
  };

  const toggleRepeatPassword = () => {
    const isAuto = autoPasswordCheckbox.checked;
    repeatPasswordInput.disabled = isAuto;
    passwordInput.disabled = isAuto;

    if (isAuto) {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      let pass = "";
      for (let i = 0; i < 12; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
      }
      passwordInput.value = pass;
      repeatPasswordInput.value = pass;
    } else {
      passwordInput.value = "";
      repeatPasswordInput.value = "";
    }
  };

  const generateNickname = () => {
    const nouns = ["fox", "owl", "lion", "wolf", "cat", "bear", "eagle", "whale", "shark", "lynx"];
    const adjectives = ["quick", "brave", "smart", "cool", "sneaky", "bright", "bold", "calm", "swift", "strong"];

    if (nickTries < 5) {
      const nick = `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
      nicknameInput.value = nick;
      nickTries++;
    } else {
      nicknameInput.disabled = false;
      nicknameInput.value = "";
      nicknameInput.placeholder = "Enter nick manually";
      generateNickBtn.disabled = true;
    }
  };

  const validateForm = () => {
    let valid = true;
    removeAllErrors();

    valid &= validateName(nameInput);
    valid &= validateName(surnameInput);
    valid &= validateEmail();
    valid &= validatePhone();
    valid &= validateBirth();
    valid &= validatePassword();

    return Boolean(valid);
  };

  const checkFormValidity = () => {
    const allFilled = [...inputs].every((input) => input.value.trim() !== "");
    const isNameValid = nameInput.value[0] === nameInput.value[0]?.toUpperCase();
    const isSurnameValid = surnameInput.value[0] === surnameInput.value[0]?.toUpperCase();
    const isEmailValid = /^[\w.-]+@[\w.-]+\.\w+$/.test(emailInput.value.trim());
    const isPhoneValid = /^\+375\d{9}$/.test(phoneInput.value.trim());

    let isBirthValid = false;
    const birthValue = birthInput.value.trim();
    const birthDate = new Date(birthValue);
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    isBirthValid = !isNaN(birthDate) && (age > 16 || (age === 16 && now >= new Date(birthDate.setFullYear(birthDate.getFullYear() + 16))));

    let isPasswordValid = true;
    if (!autoPasswordCheckbox.checked) {
      const passwordValue = passwordInput.value;
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
      isPasswordValid =
        pattern.test(passwordValue) &&
        !topPasswords.has(passwordValue.toLowerCase()) &&
        passwordValue === repeatPasswordInput.value;
    }

    const formIsValid = allFilled && isNameValid && isSurnameValid && isEmailValid && isPhoneValid && isBirthValid && isPasswordValid;

    registerBtn.disabled = !formIsValid;
    registerBtn.classList.toggle("disabled-btn", !formIsValid);
  };

  registerBtn.classList.add("disabled-btn");
  registerBtn.disabled = true;

  autoPasswordCheckbox.addEventListener("change", () => {
    toggleRepeatPassword();
    checkFormValidity();
  });

  generateNickBtn.addEventListener("click", generateNickname);

  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateForm()) {
      newUser = {
        name: nameInput.value.trim(),
        surname: surnameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        birthdate: birthInput.value.trim(),
        nickname: nicknameInput.value.trim(),
        password: passwordInput.value,
        role: "user",
      };
      modal.classList.remove("hidden");
    } else {
      console.log("Form is invalid.");
    }
  });

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      removeError(input);
      checkFormValidity();
    });
  });

  agreeCheckbox.addEventListener("change", () => {
    confirmBtn.disabled = !agreeCheckbox.checked;
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    agreeCheckbox.checked = false;
    confirmBtn.disabled = true;
  });

  confirmBtn.addEventListener("click", () => {
    if (!newUser) return;

    modal.classList.add("hidden");

    fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to create user");
        return response.json();
      })
      .then((data) => {
        console.log("User added:", data);
        alert("Account created successfully!");

        // Авто вход — сохраняем ID нового пользователя
        localStorage.setItem("userId", data.id);
        localStorage.setItem("currentUser", JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to create account");
      });

    newUser = null;
  });
});