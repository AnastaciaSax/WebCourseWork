//burger
// Обновляем размеры слайдов при изменении размера окна
const toggle = document.querySelector(".burger-toggle");
const menu = document.querySelector(".burger-menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});
// media ref allert
document.querySelectorAll('.person-info-media a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // запрещаем переход
            alert("Sorry, you can't access the team member's social media as we prioritize the safety and confidentiality of our employees ;)");
        });
    });