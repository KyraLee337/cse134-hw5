class Opinions extends HTMLElement {
    static get observedAttributes() {
        return ["hidden"];
    }

    hotTakes = [
        "C is a pretty fun language to learn",
        "CSE 29 is the best UCSD class",
        "Pointer arithmetic > anything else",
        "Segmentation faults are fun to debug",
        "GDB > debugging with print statements"
    ]

    currentIdx = 0;
    isShown = false;
    display;
    status;
    btn;

    connectedCallback() {
        if (!this.isShown) {
            this.renderTakes();
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
                this.btn.textContent = "Show Hot Takes";
            }
            else {
                this.btn.textContent = "Hide Hot Takes";
            }
        }
    }
    renderTakes() {
        const heading = document.createElement("h3");
        heading.textContent = "CS Hot Takes";

        this.display = document.createElement("p");
        this.display.setAttribute("aria-live", "polite");

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.textContent = "Next Hot Take";

        this.status = document.createElement("p");
        this.appendChild(heading);
        this.appendChild(this.display);
        this.appendChild(nextBtn);
        this.appendChild(this.status);

        nextBtn.addEventListener("click", () => {
            this.nextTake();
        });
        this.show();
        this.isShown = true;
    }

    nextTake() {
        this.currentIdx = (this.currentIdx + 1) % this.hotTakes.length;
        this.show();
    }

    show() {
        this.display.textContent = this.hotTakes[this.currentIdx];
        this.status.textContent = `Take ${this.currentIdx + 1} of ${this.hotTakes.length}`;
    }
}

if (!customElements.get("unpopular-opinions")) {
    customElements.define("unpopular-opinions", Opinions);
}