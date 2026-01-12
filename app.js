const forexPairs = [
  "EURUSD",
  "GBPUSD",
  "XAUUSD"
];

const syntheticPairs = [
  "JUMP 50",
  "STEP Index",
  "Volatility 75",
  "Volatility 100 (1s) Index"
];

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let currentCategory = "";
let currentSymbol = "";

// ---------- INIT ----------
function initMenus() {
  buildMenu("forexMenu", forexPairs);
  buildMenu("syntheticMenu", syntheticPairs);
  renderFavBar();
}

// ---------- MENU ----------
function buildMenu(menuId, list) {
  const menu = document.getElementById(menuId);
  menu.innerHTML = `<option value="">Select ⭐</option>`;

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

  if (!menu.value) return;

  currentSymbol = menu.value;
  toggleFavorite(currentSymbol);
}

// ---------- FAVORITES ----------
function toggleFavorite(sym) {
  if (favorites.includes(sym))
    favorites = favorites.filter(s => s !== sym);
  else
    favorites.push(sym);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  initMenus();
}

function renderFavBar() {
  const bar = document.getElementById("favBar");
  bar.innerHTML = "";

  const list = currentCategory === "synthetic"
    ? syntheticPairs
    : forexPairs;

  const favs = favorites.filter(f => list.includes(f));

  if (!favs.length) {
    bar.innerHTML = `<div class="instrument empty">Select instrument</div>`;
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

// ---------- TRADE SENDER ----------
function sendTrade(action) {
  if (!currentSymbol) {
    alert("No instrument selected");
    return;
  }

  const payload = { action, symbol: currentSymbol };

  console.log("📤 Sending:", payload);

  fetch("http://localhost:3000/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(r => r.text())
    .then(t => console.log("✅ Server:", t))
    .catch(e => console.error("❌ Error:", e));
}

initMenus();
