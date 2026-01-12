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
  "Volatility 75",
  "Volatility 100 (1s) Index"
];

/* ===============================
   STATE
================================ */
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let currentCategory = "";
let currentSymbol = "";

/* ===============================
   INIT MENUS
================================ */
function initMenus() {
  buildMenu("forexMenu", forexPairs);
  buildMenu("syntheticMenu", syntheticPairs);
  renderFavBar();
}

function buildMenu(menuId, list) {
  const menu = document.getElementById(menuId);
  menu.innerHTML = `<option value="">Favored ⭐</option>`;

  list.forEach(sym => {
    const star = favorites.includes(sym) ? "⭐" : "☆";
    menu.innerHTML += `<option value="${sym}">${star} ${sym}</option>`;
  });
}

function handleMenu(category) {
  debugLog("Menu selected", category);
  currentCategory = category;

  const menu = document.getElementById(
    category === "forex" ? "forexMenu" : "syntheticMenu"
  );

  const val = menu.value;

  if (val === "") {
    renderFavBar();
    return;
  }

  currentSymbol = val;
  toggleFavorite(val);
}

function toggleFavorite(sym) {
  if (favorites.includes(sym)) {
    favorites = favorites.filter(s => s !== sym);
  } else {
    favorites.push(sym);
  }

  debugLog("Favorite toggled", favorites);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  initMenus();
}

/* ===============================
   FAVORITES BAR
================================ */
function renderFavBar() {
  const bar = document.getElementById("favBar");
  bar.innerHTML = "";

  let list =
    currentCategory === "synthetic"
      ? syntheticPairs
      : forexPairs;

  const favs = favorites.filter(f => list.includes(f));

  if (favs.length === 0) {
    bar.innerHTML =
      `<div class="instrument empty">Select instrument from menu above</div>`;
    return;
  }

  favs.forEach(sym => {
    const div = document.createElement("div");
    div.className =
      "instrument" + (sym === currentSymbol ? " active" : "");
    div.textContent = sym;
    div.onclick = () => {
      currentSymbol = sym;
      renderFavBar();
    };
    bar.appendChild(div);
  });
}

/* ===============================
   TELEGRAM TRADE SENDER (FIXED)
================================ */
function sendTrade(action) {
  if (!currentSymbol) {
    alert("No instrument selected");
    return;
  }

  const payload = {
    action: action,
    symbol: currentSymbol
  };

  debugLog("📤 Sending trade", payload);

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
  } else {
    console.warn("⚠ Telegram WebApp not detected");
  }
}

/* ===============================
   DEBUG LOGGER
================================ */
function debugLog(label, data) {
  console.log("[EA PANEL]", label, data);
}

/* ===============================
   TELEGRAM WEBAPP INIT (REQUIRED)
================================ */
window.onload = () => {
  initMenus();

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    console.log("✅ Telegram WebApp ready");
  } else {
    console.log("⚠ Not running inside Telegram");
  }
};
