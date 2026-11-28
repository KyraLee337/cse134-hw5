const KEY = "hw5-dad-jokes";

class DadJoke extends HTMLElement {
    static get observedAttributes() {
        return ["compact"];
    }

    isShown = false;
    display;
    status;
    btn;
    jokeBtn;
    btnB = false;
    details;

    connectedCallback() {
        if (!this.isShown) {
            this.renderJoke();
            this.dadJoke();
        }

        this.btn = document.getElementById("toggle-details");
        if (this.btn) {
            this.btn.hidden = false;
            if (!this.btnB) {
                this.btn.addEventListener("click", () => {
                    const compact = this.toggleAttribute("hidden");
                    if (compact) {
                        this.savePreference("compact");
                    }
                    else {
                        this.savePreference("expanded");
                    }
                });
            this.btnB = true;
        }
        }
        const saved = this.loadPreference();
        this.toggleAttribute("compact", saved === "compact");
        this.updateState(this.hasAttribute("compact"));
    }

    loadPreference() {
        try {
            const value = localStorage.getItem(KEY);
            if (value === "compact" || value === "expanded") {
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

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "compact") {
            this.updateState(newVal !== null);
        }
    }

    updateState(compact) {
        if (this.details) {
            this.details.hidden = compact;
        }
        if (this.btn) {
            this.btn.textContent = "Show Dad Jokes";
        }
        else {
            this.btn.textContent = "Hide Dad Jokes";
        }
        this.btn.setAttribute("aria-expanded", String(!compact));
    }
    renderJoke() {
        const heading = document.createElement("h3");
        heading.textContent = "Dad Jokes";
    
        this.details = document.createElement("div");
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
        this.details.appendChild(this.jokeBtn);
        this.details.appendChild(this.display);
        this.details.appendChild(this.status);
        this.appendChild(heading);
        this.appendChild(this.details);
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