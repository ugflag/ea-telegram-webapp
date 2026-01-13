/* ===============================
   INSTRUMENT LISTS
================================ */
const forexPairs = [
  "EURUSD",
  "GBPUSD",
  "XAUUSD"
];

const syntheticPairs = [
  "JUMP 50",
  "STEP Index",
  "Volatility 100 (1s) Index"
];

/* ===============================
   STATE
================================ */
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let currentCategory = "";
let currentSymbol = "";

/* ===============================
   INIT
================================ */
function initMenus() {
  buildMenu("forexMenu", forexPairs);
  buildMenu("syntheticMenu", syntheticPairs);
  renderFavBar();
}

/* ===============================
   MENU BUILDERS
================================ */
function buildMenu(menuId, list) {
  const menu = document.getElementById(menuId);
  menu.innerHTML = `<option value="">Select Instrument</option>`;

  list.forEach(sym => {
    const star = favorites.includes(sym) ? "⭐" : "☆";
    menu.innerHTML += `<option value="${sym}">${star} ${sym}</option>`;
  });
}

function handleMenu(category) {
  currentCategory = category;

  const menu = document.getElementById(
    category === "forex" ? "forexMenu" : "syntheticMenu"
  );

  const val = menu.value;
  if (!val) return;

  currentSymbol = val;
  toggleFavorite(val);
}

/* ===============================
   FAVORITES
================================ */
function toggleFavorite(sym) {
  if (favorites.includes(sym)) {
    favorites = favorites.filter(s => s !== sym);
  } else {
    favorites.push(sym);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  initMenus();
}

function renderFavBar() {
  const bar = document.getElementById("favBar");
  bar.innerHTML = "";

  const list =
    currentCategory === "synthetic"
      ? syntheticPairs
      : forexPairs;

  const favs = favorites.filter(f => list.includes(f));

  if (favs.length === 0) {
    bar.innerHTML =
      `<div class="instrument empty">Select instrument above</div>`;
    return;
  }

  favs.forEach(sym => {
    const div = document.createElement("div");
    div.className = "instrument" + (sym === currentSymbol ? " active" : "");
    div.textContent = sym;
    div.onclick = () => {
      currentSymbol = sym;
      renderFavBar();
    };
    bar.appendChild(div);
  });
}

/* ===============================
   🚀 FAST EXECUTION (NO TELEGRAM)
================================ */
function sendTrade(action) {
  console.log("🟡 BUTTON CLICKED:", action);

  if (!currentSymbol) {
    alert("No instrument selected");
    return;
  }

  const payload = {
    action: action,
    symbol: currentSymbol
  };

  console.log("📤 Sending trade:", payload);

  fetch("http://localhost:3000/telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(msg => console.log("✅ Server response:", msg))
    .catch(err => console.error("❌ Send failed:", err));
}

/* ===============================
   START
================================ */
document.addEventListener("DOMContentLoaded", initMenus);
