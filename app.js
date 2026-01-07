const tg = window.Telegram.WebApp;
tg.expand();

let currentSymbol = "";
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

const forexList = [
  "Favored",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "XAGUSD"
];

const syntheticList = [
  "Favored",
  "Volatility 75 Index",
  "Volatility 100 Index",
  "Jump 50 Index",
  "Boom 1000 Index"
];

function populateSelect(id, list) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";

  list.forEach(sym => {
    if (sym === "Favored") {
      sel.add(new Option("⭐ Favored", "FAV"));
      return;
    }

    if (sel.value === "FAV" && !favorites.includes(sym)) return;

    let label = sym + (favorites.includes(sym) ? " ⭐" : "");
    sel.add(new Option(label, sym));
  });
}

function refreshAll() {
  populateSelect("forexSelect", forexList);
  populateSelect("syntheticSelect", syntheticList);
}

document.getElementById("forexSelect").addEventListener("change", e => {
  if (e.target.value === "FAV") {
    populateSelect("forexSelect", forexList);
    return;
  }
  currentSymbol = e.target.value;
  document.getElementById("syntheticSelect").value = "";
});

document.getElementById("syntheticSelect").addEventListener("change", e => {
  if (e.target.value === "FAV") {
    populateSelect("syntheticSelect", syntheticList);
    return; 
  }
  currentSymbol = e.target.value;
  document.getElementById("forexSelect").value = "";
});

function sendAction(action) {
  if (!currentSymbol && ["BUY", "SELL", "CLOSE"].includes(action)) {
    alert("Select an instrument first");
    return;
  }

  tg.sendData(JSON.stringify({
    action,
    symbol: currentSymbol,
    time: Date.now()
  }));
}

refreshAll();
