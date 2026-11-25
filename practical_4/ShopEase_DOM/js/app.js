/* ShopEase Storefront - DOM manipulation & event handling (Practical 4) */
"use strict";

/* ---------- Data ---------- */
const PRODUCTS = [
  { id: 1, name: "Laptop Pro 14",      category: "Electronics", price: 64999, img: "img/laptop.jpg" },
  { id: 2, name: "Mirrorless Camera",  category: "Electronics", price: 48500, img: "img/camera.jpg" },
  { id: 3, name: "Snack Hamper",       category: "Grocery",     price: 899,   img: "img/food.jpg" },
  { id: 4, name: "Gaming Laptop",      category: "Electronics", price: 89999, img: "img/laptop.jpg" },
  { id: 5, name: "Action Camera",      category: "Electronics", price: 18999, img: "img/camera.jpg" },
  { id: 6, name: "Gourmet Food Box",   category: "Grocery",     price: 1499,  img: "img/food.jpg" }
];
const DEALS = [
  "Flat 10% off on Electronics",
  "Free delivery on orders above \u20B91000",
  "Buy a camera, get a memory card free"
];

/* ---------- Element references (querySelector) ---------- */
const grid        = document.querySelector("#productGrid");
const searchBox   = document.querySelector("#searchBox");
const filterSel   = document.querySelector("#categoryFilter");
const countBadge  = document.querySelector("#resultCount");
const keyHint     = document.querySelector("#keyHint");
const cartList    = document.querySelector("#cartList");
const cartTotal   = document.querySelector("#cartTotal");
const previewImg  = document.querySelector("#previewImg");
const previewName = document.querySelector("#previewName");
const eventLog    = document.querySelector("#eventLog");
const toast       = document.querySelector("#toast");

let cart = [];
let dealIndex = 0;
let toastTimer;

/* ---------- Helpers ---------- */
const rupees = n => "\u20B9" + n.toLocaleString("en-IN");

function showToast(message) {            // feedback message
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

function logEvent(type, detail) {        // live content update
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  li.innerHTML = `<b>${type}</b> &ndash; ${detail} <small>(${time})</small>`;
  eventLog.prepend(li);
  while (eventLog.children.length > 8) {
    eventLog.removeChild(eventLog.lastElementChild);
  }
}

/* ---------- Create & append: product cards ---------- */
function renderProducts() {
  const text = searchBox.value.trim().toLowerCase();
  const cat  = filterSel.value;
  const list = PRODUCTS.filter(p =>
    (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(text)
  );

  grid.innerHTML = "";                    // clear old cards
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = p.id;

    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.name;

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `<h3>${p.name}</h3><span class="cat">${p.category}</span>
                      <p class="price">${rupees(p.price)}</p>`;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "add-btn";
    btn.textContent = "Add to cart";

    info.appendChild(btn);
    card.append(img, info);
    grid.appendChild(card);
  });

  // modify content + style dynamically
  countBadge.textContent = list.length + (list.length === 1 ? " item" : " items");
  countBadge.style.color = list.length === 0 ? "#ef4444" : "";
  countBadge.style.borderColor = list.length === 0 ? "#ef4444" : "";
}

/* ---------- Cart ---------- */
function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Cart is empty";
    cartList.appendChild(li);
  }
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;
    li.innerHTML = `<span>${item.name}</span><span>${rupees(item.price)}</span>`;
    cartList.appendChild(li);
  });
  const sum = cart.reduce((s, p) => s + p.price, 0);
  cartTotal.textContent = "Total: " + rupees(sum);
}

/* ---------- Events: catalog (delegated) ---------- */
grid.addEventListener("click", e => {                       // click
  const btn = e.target.closest(".add-btn");
  if (!btn) return;
  const id = Number(btn.closest(".card").dataset.id);
  const product = PRODUCTS.find(p => p.id === id);
  cart.push(product);
  renderCart();
  showToast(product.name + " added to cart");
  logEvent("click", "added " + product.name);
});

grid.addEventListener("mouseover", e => {                   // mouseover
  const card = e.target.closest(".card");
  if (!card) return;
  const product = PRODUCTS.find(p => p.id === Number(card.dataset.id));
  previewImg.setAttribute("src", product.img);              // change attributes
  previewImg.setAttribute("alt", product.name);
  previewName.textContent = product.name + " - " + rupees(product.price);
});

grid.addEventListener("mouseout", e => {                    // mouseout
  const card = e.target.closest(".card");
  if (card && !card.contains(e.relatedTarget)) {
    previewName.textContent = "Hover over a product card.";
    logEvent("mouseout", "left a product card");
  }
});

/* ---------- Events: search & filter ---------- */
searchBox.addEventListener("keydown", e => {                // keydown
  keyHint.textContent = "keydown: " + (e.key === " " ? "Space" : e.key);
});
searchBox.addEventListener("keyup", () => {                 // keyup
  renderProducts();
  logEvent("keyup", `search = "${searchBox.value.trim()}"`);
});
searchBox.addEventListener("focus", () => {
  searchBox.setAttribute("placeholder", "e.g. camera, laptop, food");
});
searchBox.addEventListener("blur", () => {
  searchBox.setAttribute("placeholder", "Search products...");
});
filterSel.addEventListener("change", () => {                // change
  renderProducts();
  showToast("Showing: " + filterSel.value);
  logEvent("change", "category = " + filterSel.value);
});

/* ---------- Events: cart ---------- */
cartList.addEventListener("dblclick", e => {                // double-click
  const li = e.target.closest("li[data-index]");
  if (!li) return;
  const [removed] = cart.splice(Number(li.dataset.index), 1);
  renderCart();
  showToast(removed.name + " removed");
  logEvent("dblclick", "removed " + removed.name);
});

document.querySelector("#removeLast").addEventListener("click", () => {
  if (!cart.length) { showToast("Nothing to remove"); return; }
  const removed = cart.pop();
  renderCart();
  showToast(removed.name + " removed");
  logEvent("click", "removed last item");
});

/* ---------- Replace element: deals ---------- */
document.querySelector("#swapDeal").addEventListener("click", () => {
  const slot = document.querySelector("#dealSlot");
  dealIndex = (dealIndex + 1) % DEALS.length;
  const fresh = document.createElement("div");
  fresh.className = "deal" + (dealIndex % 2 ? " alt" : "");
  fresh.textContent = DEALS[dealIndex];
  slot.replaceChild(fresh, slot.firstElementChild);         // replace
  logEvent("replace", "deal #" + (dealIndex + 1));
});

/* ---------- Dynamic menu & theme ---------- */
const menuBtn = document.querySelector("#menuToggle");
menuBtn.addEventListener("click", () => {
  const nav = document.querySelector("#mainNav");
  const closed = nav.classList.toggle("collapsed");
  menuBtn.setAttribute("aria-expanded", String(!closed));
  logEvent("click", closed ? "menu closed" : "menu opened");
});

const themeBtn = document.querySelector("#themeToggle");
themeBtn.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = next;
  themeBtn.textContent = next === "dark" ? "Light mode" : "Dark mode";
  showToast(next + " theme on");
});

/* ---------- Selector lab: all five DOM selection methods ---------- */
document.querySelector("#runSelectors").addEventListener("click", () => {
  const byId    = document.getElementById("cartTotal");
  const byClass = document.getElementsByClassName("panel");
  const byTag   = document.getElementsByTagName("button");
  const one     = document.querySelector(".card h3");
  const all     = document.querySelectorAll(".card");

  document.querySelector("#selectorOutput").textContent =
    `getElementById("cartTotal")        -> "${byId.textContent}"\n` +
    `getElementsByClassName("panel")    -> ${byClass.length} elements\n` +
    `getElementsByTagName("button")     -> ${byTag.length} elements\n` +
    `querySelector(".card h3")          -> "${one ? one.textContent : "none"}"\n` +
    `querySelectorAll(".card")          -> ${all.length} elements`;
  logEvent("click", "ran selector lab");
});

/* ---------- Init ---------- */
renderProducts();
renderCart();
logEvent("load", "storefront ready");
