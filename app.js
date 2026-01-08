const forexPairs = [
  "EURUSD",
  "GBPUSD",
  "XAUUSD"
];

const syntheticPairs = [
  "JUMP 50",
  "STEP Index",
  "Volatility 75"
];

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let currentCategory = "";
let currentSymbol = "";

// INIT MENUS
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
    debugLog("Favorite toggled", favorites);      //??
  } else {
    favorites.push(sym);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  initMenus();
}

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
    div.className = "instrument" + (sym === currentSymbol ? " active" : "");
    div.textContent = sym;
    div.onclick = () => {
      currentSymbol = sym;
      renderFavBar();
    };
    bar.appendChild(div);
  });
}

function sendTrade(action) {
  if (!currentSymbol) {
    alert("No instrument selected");
    return;
  }

  const payload = {
    action: action,
    symbol: currentSymbol
  };

  if (window.Telegram?.WebApp) {
    debugLog("Trade sent", payload);
    Telegram.WebApp.sendData(JSON.stringify(payload));
  } else {
    console.log(payload);
  }
}

initMenus();


/* ===== DEBUG LOGGER (STEP 1.2 - OPTION A) ===== */
function debugLog(label, data) {
  console.log("[EA PANEL]", label, data);
}

