# ITUS102 – Practical 6: Asynchronous JavaScript and Browser Storage

**Scenario:** WanderGo Travels Pvt. Ltd.  
**Level:** First-year students (beginner)  
**Duration:** 3 hours (2.5 hours implementation + 0.5 hour testing/evaluation)

## Files

| File | Purpose |
|---|---|
| `practical_6.html` | Structure and interactive buttons |
| `style.css` | Simple responsive page styling |
| `practical6.js` | Timers, callbacks, Fetch API, error handling and storage |
| `packages.json` | Five sample travel packages |
| `Practical6_Interactive_Demo.html` | Standalone teaching/demo page (also at the top level of ZIP) |

## How to run (important)

### Option A – VS Code Live Server
1. Extract the ZIP file and open the **`practical6_wtf`** folder in VS Code.
2. Install the **Live Server** extension if necessary.
3. Right-click `practical_6.html` → **Open with Live Server**.
4. The project opens at an address such as `http://127.0.0.1:5500/practical_6.html`.
5. Click **Load Travel Packages** to verify Fetch API works.

### Option B – Python (no extension needed)
Open a terminal **inside** the `practical6_wtf` folder and run:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/practical_6.html` in Chrome or Firefox. Stop the server with **Ctrl+C**.

**Do not double-click `practical_6.html` for the main exercise.** Most browsers block `fetch("packages.json")` from a `file://` page. This is a browser security rule, not a coding error. You do **not** need a Node.js or database backend.

## How to use the standalone interactive demo
Open `Practical6_Interactive_Demo.html` directly in a browser. It contains its own CSS, JavaScript and sample JSON and shows each topic alongside short code examples. It uses a temporary `Blob` URL to demonstrate real `fetch()` requests, so no server is needed for that demo. The main practical deliberately fetches the separate `packages.json` file.

## Practical exercises and expected results

1. **setTimeout():** After 3 seconds the header displays a special offer.
2. **setInterval():** A travel message changes every 5 seconds. Click Stop to demonstrate `clearInterval()`.
3. **Fetch and JSON:** Click Load Travel Packages to display five cards from the JSON file.
4. **Filters:** Choose a destination and see the matching package(s) without a page reload.
5. **Error handling:** Click Test Error Handling to try a missing JSON file, see an error and recover by clicking Load Travel Packages.
6. **Callback:** Click Simulate Booking Request and observe "started" then "callback executed" after 1.5 seconds. No booking is made.
7. **Local Storage:** Choose a destination and switch to dark mode; refresh the page and load packages again to check restored preferences.
8. **Session Storage:** Save a name; refresh the page in the same tab to see that it remains. Clear it using the button.

## Simple testing checklist

- [ ] Website looks appropriate on phone and laptop sizes.
- [ ] Offer appears once after 3 seconds.
- [ ] Promotional message repeats and can be stopped.
- [ ] Five JSON packages load without refreshing.
- [ ] Filtering changes the displayed cards.
- [ ] Missing JSON file shows an understandable error message.
- [ ] Callback shows the final message after the delay.
- [ ] Theme and destination preference survive reloading.
- [ ] Guest name survives reloading within the tab session.
- [ ] No JavaScript errors appear in Developer Tools → Console.

## Viva preparation

**Q1:** What is synchronous vs asynchronous JavaScript?  
**A:** Synchronous code runs one instruction after another. Asynchronous operations such as timers and Fetch allow another task to finish later, without blocking normal page interaction.

**Q2:** What is a callback?  
**A:** A function passed as an argument to another function, to be executed when needed.

**Q3:** What is the Fetch API?  
**A:** A browser API for making HTTP requests. This practical uses it to read `packages.json` and convert the response to JavaScript objects.

**Q4:** What is AJAX?  
**A:** A technique for communicating with a server without reloading the whole webpage. Modern AJAX can use Fetch API; it does not require XML.

**Q5:** Why use `.catch()`?  
**A:** It handles failures such as unreachable resources or invalid JSON, so the user sees a meaningful message.

**Q6:** Local Storage vs Session Storage?  
**A:** Local Storage persists across browser restarts unless cleared. Session Storage is scoped to the browser tab's page session and usually remains across reloads of that tab.

## Optional practice for students

1. Add one more destination to `packages.json`.
2. Change the `setTimeout()` delay to 5 seconds.
3. Change `setInterval()` from 5 seconds to 3 seconds.
4. Add a new filter for packages below ₹10,000.
5. Add a button to reset the filter.

**Educational note:** Prices and promotions are illustrative. No real booking, server authentication or payment is involved.
