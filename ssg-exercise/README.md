# Configuration

## About
Replicated the `Home` (~/ssg-exercise/src/pages/index.astro) and `About` (~/ssg-exercise/src/pages/about.astro) page of my portfolio using Astro and it used a shared `Footer.astro` in replacement of the copied footer component.


## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
|`npm run build` | Builds source code |
| `npm run preview` | Local preview of produced files |

## Design Note on `<dad-jokes>` component

### Goal:
On the `About` page of the site, a user can load dad jokes upon clicking the `Make me groan button`. Can be toggled as well.

### Trace of request:
1. Visitor clicks the `Make me groan` button inside of the `<dad-jokes>` component. This activates the event listener by click, which calls the `dadJoke()` function.
2. In the waiting phase after the request starts, the button for a new dad joke is disabled so that someone can't spam the requests. The status gets changed to `Cooking a new joke...` to let users know that there is a request being processed.
3. A `GET` request is sent to the site. If the response is ok, the JSON body gets parsed and checks if the joke data is a string.
4. Success/Fail state
    - Success: The joke is written onto the display and the status gets changed to `Please Laugh`.
    - Fail: The `catch` portion logs the error and sets the status to say `Could not load a joke. Try again.` and the button also says `Try again`
    - finally: The `finally` block enables the button again.