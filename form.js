const form = document.querySelector("form");
form.setAttribute("novalidate", "");
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputComments = document.getElementById("comments");

const errorName = document.getElementById("error-name");
const errorEmail = document.getElementById("error-email");
const errorComments = document.getElementById("error-comments");

let name = false;
let email = false;
let comments = false;

const charCount = document.getElementById("char-count");
charCount.hidden = false;
const maxChars = 1000;

const hiddenFormErrors = document.getElementById("form-errors");
const form_errors = [];
let attempts = 0;

function validateName() {
    const str = inputName.value.trim();
    if (str.length === 0) {
        inputName.setCustomValidity("Please enter a name that isn't just spaces!");
    }
    else {
        inputName.setCustomValidity("");
    }
    return inputName.validationMessage;
};

function validateEmail() {
    inputEmail.setCustomValidity("");
    if (inputEmail.validity.valueMissing) {
        inputEmail.setCustomValidity("Must enter an email");
    }
    else if (inputEmail.validity.typeMismatch) {
        inputEmail.setCustomValidity("Enter a valid email in the format of example@email.com");
    }
    return inputEmail.validationMessage;
};

function validateComments() {
    const str = inputComments.value.trim();
    if (str.length === 0) {
        inputComments.setCustomValidity("Enter a non-empty comment.");
    }
    else if (str.length < 5) {
        inputComments.setCustomValidity("Write at least 5 characters, excluding spaces at the beginning and end.");
    }
    else {
        inputComments.setCustomValidity("");
    }
    return inputComments.validationMessage;
}

function showHideError(input, error, message) {
    error.textContent = message;
    if (message != "") {
        input.setAttribute("aria-invalid", "true");
    }
    else {
        input.removeAttribute("aria-invalid");
    }
}
 
inputName.addEventListener("input", () => {
    name = true;
    const message = validateName();
    if (errorName.textContent !== "") {
        showHideError(inputName, errorName, message);
    }
});

inputName.addEventListener("blur", () => {
    if (name) {
        const message = validateName();
        showHideError(inputName, errorName, message);
    }
})

inputEmail.addEventListener("input", () => {
    email = true;
    const message = validateEmail();
    if (errorEmail.textContent !== "") {
        showHideError(inputEmail, errorEmail, message);
    }
});

inputEmail.addEventListener("blur", () => {
    if (email) {
        const message = validateEmail();
        showHideError(inputEmail, errorEmail, message);
    }
});

inputComments.addEventListener("input", () => {
    comments = true;
    const message = validateComments();
    if (errorComments.textContent !== "") {
        showHideError(inputComments, errorComments, message);
    }
});

inputComments.addEventListener("blur", () => {
    if (comments) {
        const message = validateComments();
        showHideError(inputComments, errorComments, message);
    }
});

form.addEventListener("submit", (event) => {
    const messageName = validateName();
    const messageEmail = validateEmail();
    const messageComments = validateComments();

    showHideError(inputName, errorName, messageName);
    showHideError(inputEmail, errorEmail, messageEmail);
    showHideError(inputComments, errorComments, messageComments);

    if (messageName || messageEmail || messageComments) {
        event.preventDefault();
        attempts++;
        if (messageName) {
            form_errors.push({attempt: attempts, field: "name", error: messageName});
        }
        if (messageEmail) {
            form_errors.push({attempt: attempts, field: "email", error: messageEmail});
        }
        if (messageComments) {
            form_errors.push({attempt: attempts, field: "comments", error: messageComments});
        }
        if (messageName) {
            inputName.focus();
        }
        else if (messageEmail) {
            inputEmail.focus();
        }
        else {
            inputComments.focus();
        }
    }
    hiddenFormErrors.value = JSON.stringify(form_errors);
});

inputComments.addEventListener("input", () => {
    let remaining = maxChars - inputComments.value.length;
    charCount.textContent = `${remaining} characters left`;
    if (remaining === 0) {
        charCount.textContent = "Character limit reached."
        charCount.classList.add("limit-warn");
    }
    else if (remaining <= 25) {
        charCount.textContent = `Warning: ${remaining} character remaining`;
        charCount.classList.add("limit-warn");
    }
    else {
        charCount.textContent = `${remaining} characters left`;
        charCount.classList.remove("limit-warn");
    }
});