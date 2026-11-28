const KEY = "hw5-dad-jokes";
const ITEM = "hw5-dad-jokes-item";

class DadJoke extends HTMLElement {
    static get observedAttributes() {
        return ["hidden"];
    }

    isShown = false;
    display;
    status;
    btn;
    jokeBtn;
    btnB = false;

    connectedCallback() {
        if (!this.isShown) {
            this.renderJoke();
            const savedJoke = this.loadItem();
            if (savedJoke) {
                this.display.textContent = savedJoke.joke;
                this.display.dataset.id = savedJoke.id ?? "";
                this.status.textContent = "Showing saved joke"
            }
            else {
                this.dadJoke();
            }
        }

        this.btn = document.getElementById("toggle-details");
        if (this.btn) {
            this.btn.hidden = false;
            if (!this.btnB) {
                this.btn.addEventListener("click", () => {
                    const hiddenChoice = this.toggleAttribute("hidden");
                    if (hiddenChoice) {
                        this.savePreference("hidden");
                    }
                    else {
                        this.savePreference("visible");
                    }
                });
            this.btnB = true;
        }
        }
        const saved = this.loadPreference();
        this.toggleAttribute("hidden", saved === "hidden");
        this.updateState(this.hasAttribute("hidden"));
    }

    loadPreference() {
        try {
            const value = localStorage.getItem(KEY);
            if (value === "hidden" || value === "visible") {
                return value;
            }
        }
        catch (error) {
            console.warn("Could not read preferences.", error);
        }
        return "visible";
    }

    savePreference(value) {
        try {
            localStorage.setItem(KEY, value);
        }
        catch (error) {
            console.warn("Could not save preferences.", error);
        }
    }

    loadItem() {
        try {
            const raw = localStorage.getItem(ITEM);
            if (!raw) {
                return null;
            }
            const item = JSON.parse(raw);
            if (typeof item?.joke === "string") {
                return item;
            }
        }
        catch (error) {
            console.warn("Could not read saved joke", error);
        }
        return null;
    }

    saveItem(item) {
        try {
            localStorage.setItem(ITEM, JSON.stringify(item));
        }
        catch (error) {
            console.warn("Could not save joke.", error);
        }
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "hidden") {
            const isHidden = newVal !== null;
            this.updateState(isHidden);
        }
    }

    updateState(isHidden) {
        if (this.btn) {
            if (isHidden) {
                this.btn.textContent = "Show Dad Jokes";
            }
            else {
                this.btn.textContent = "Hide Dad Jokes";
            }
        }
    }
    renderJoke() {
        const heading = document.createElement("h3");
        heading.textContent = "Dad Jokes";
    
        this.jokeBtn = document.createElement("button");
        this.jokeBtn.type = "button";
        this.jokeBtn.textContent = "Make me groan";
        this.display = document.createElement("p");
        this.display.setAttribute("aria-live", "polite")
        this.status = document.createElement("p");
        this.status.setAttribute("role", "status");
    
        this.jokeBtn.addEventListener("click", () => {
            this.dadJoke();
        });
        this.appendChild(heading);
        this.appendChild(this.jokeBtn);
        this.appendChild(this.display);
        this.appendChild(this.status);
        this.isShown = true;
    }
    
    async dadJoke() {
        this.jokeBtn.disabled = true;
        this.status.textContent = "Cooking a new joke...";
    
        try {
            const response = await fetch("https://icanhazdadjoke.com/", {
                headers: { 
                    Accept: "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }
            const data = await response.json();
            if (typeof data?.joke !== "string") {
                throw new Error("Expected a joke in the response.");
            }
            this.display.textContent = data.joke;
            this.display.dataset.id = typeof data?.id === "string" ? data.id: "";
            this.saveItem({ id: data.id, joke: data.joke });
            this.status.textContent = "Please Laugh";
            this.jokeBtn.textContent = "Make me groan";
        }
        catch (error) {
            console.error("Could not load the joke.", error);
            this.status.textContent = "Could not load a joke. Try again.";
            this.jokeBtn.textContent = "Try again";
        }
        finally {
            this.jokeBtn.disabled = false;
        }
    }
}

if (!customElements.get("dad-jokes")) {
    customElements.define("dad-jokes", DadJoke);
}