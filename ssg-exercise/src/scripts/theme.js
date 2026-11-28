const toggleTheme = document.getElementById("toggle-theme");

function getTheme() {
    try {
        return localStorage.getItem("theme");
    }
    catch (error) {
        return null;
    }
}

function save(theme) {
    try {
        localStorage.setItem("theme", theme);
    }
    catch (error) {
    }
}

function apply(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("theme-data", "dark");
        if (toggleTheme) {
            toggleTheme.textContent = "Switch to light mode";
            toggleTheme.setAttribute("aria-pressed", "true");
        }
    }
    else {
        document.documentElement.removeAttribute("theme-data");
        if (toggleTheme) {
            toggleTheme.textContent = "Switch to dark mode";
            toggleTheme.setAttribute("aria-pressed", "false");
        }
    }
}

function themeToggle() {
    const darkTheme = document.documentElement.getAttribute("theme-data") === "dark";
    let oppositeTheme = "dark";

    if (darkTheme) {
        oppositeTheme = "light";
    }
    apply(oppositeTheme, toggleTheme);
    save(oppositeTheme);
}

function init() {
    const toggleTheme = document.getElementById("toggle-theme");
    let saved = "light";
    if (getTheme() === "dark") {
        saved = "dark";
    }
    apply(saved, toggleTheme);
    if (toggleTheme) {
        toggleTheme.hidden = false;
        toggleTheme.addEventListener("click", () => {
            themeToggle(toggleTheme);
        });
    }
}

init();