class DadJoke extends HTMLElement {
    static get observedAttributes() {
        return ["hidden"];
    }

    isShown = false;
    display;
    status;
    btn;
    jokeBtn;

    connectedCallback() {
        if (!this.isShown) {
            this.renderJoke();
            this.dadJoke();
        }

        this.btn = document.getElementById("toggle-details");
        if (this.btn) {
            this.btn.hidden = false;
            this.btn.addEventListener("click", () => {
                this.toggleAttribute("hidden");
            });
        }
        this.updateState(this.hasAttribute("hidden"));
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
            this.status.textContent = "Please Laugh";
            this.jokeBtn.textContent = "Make me Groan";
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