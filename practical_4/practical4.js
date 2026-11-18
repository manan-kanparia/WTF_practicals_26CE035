// Practical 4 - DOM Manipulation and Event Handling
// ShopEase Online Store

// Small helper to shorten document.getElementById
function $(id) {
    return document.getElementById(id);
}

// 1. Selecting HTML elements
$("selectBtn").addEventListener("click", function () {
    const byId = document.getElementById("selectMessage");
    const byClass = document.getElementsByClassName("demoClass");
    const byTag = document.getElementsByTagName("p");
    const firstBox = document.querySelector(".box");
    const allBoxes = document.querySelectorAll(".box");

    $("selectOutput").innerHTML =
        "By id: " + byId.textContent +
        "<br>By class name: " + byClass.length + " elements" +
        "<br>By tag name: " + byTag.length + " paragraphs" +
        "<br>querySelector: first match is a " + firstBox.tagName +
        "<br>querySelectorAll: " + allBoxes.length + " boxes found";
});

// 2. Change content, attribute and style
$("contentBtn").addEventListener("click", function () {
    $("changeText").textContent = "Big Sale: up to 40% off on selected items!";
});

$("attributeBtn").addEventListener("click", function () {
    const link = $("shopLink");
    link.setAttribute("href", "https://www.wikipedia.org");
    link.textContent = "Open Wikipedia";
});

$("styleBtn").addEventListener("click", function () {
    const text = $("changeText");
    text.style.color = "#c0392b";
    text.style.fontWeight = "bold";
    text.style.fontSize = "18px";
});

// 3. Create, append, replace and remove elements
const products = ["Headphones", "Keyboard", "Backpack", "Sunglasses", "Power Bank"];
let productCount = 0;

$("addBtn").addEventListener("click", function () {
    const item = document.createElement("li");
    item.textContent = products[productCount % products.length];
    productCount++;
    $("productList").appendChild(item);
});

$("replaceBtn").addEventListener("click", function () {
    const list = $("productList");
    if (list.children.length === 0) { return; }

    const item = document.createElement("li");
    item.textContent = "Smart Watch";
    list.replaceChild(item, list.firstElementChild);
});

$("removeBtn").addEventListener("click", function () {
    const list = $("productList");
    if (list.children.length === 0) { return; }
    list.removeChild(list.lastElementChild);
});

// 4. Click and double-click events
$("clickBtn").addEventListener("click", function () {
    $("clickOutput").textContent = "Single click detected.";
});

$("doubleBtn").addEventListener("dblclick", function () {
    $("clickOutput").textContent = "Double click detected.";
});

// 5. Mouse events
const mouseBox = $("mouseBox");

mouseBox.addEventListener("mouseenter", function () {
    $("mouseOutput").textContent = "Mouse is inside the box.";
    mouseBox.classList.add("highlight");
});

mouseBox.addEventListener("mouseleave", function () {
    $("mouseOutput").textContent = "Mouse has left the box.";
    mouseBox.classList.remove("highlight");
});

// 6. Keyboard events
const nameInput = $("nameInput");

nameInput.addEventListener("keydown", function (event) {
    $("keyOutput").textContent = "You pressed: " + event.key;
});

nameInput.addEventListener("keyup", function () {
    const name = nameInput.value.trim();
    $("keyOutput").textContent = name === "" ? "Input is empty." : "Hello, " + name + "!";
});

// 7. Change event
$("categorySelect").addEventListener("change", function () {
    const value = this.value;
    $("changeOutput").textContent = value === "" ? "No category selected." : "You chose: " + value;
});

// 8. Theme switching
$("themeBtn").addEventListener("click", function () {
    document.body.classList.toggle("dark");
    this.textContent = document.body.classList.contains("dark") ? "Switch to Light Theme" : "Switch Theme";
});

// 9. Image preview
$("imageSelect").addEventListener("change", function () {
    const preview = $("previewImage");
    preview.src = this.value;
    preview.alt = this.options[this.selectedIndex].text + " preview";
});

// 10. Dynamic menu (toggles the "open" class, styled in style.css)
$("menuBtn").addEventListener("click", function () {
    $("menu").classList.toggle("open");
});
