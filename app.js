// ================================
// Telegram WebApp Init
// ================================
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// ================================
// State
// ================================
let selectedInstrument = "";
let selectedCategory = "";

// ================================
// Instrument Lists
// ================================
const forexList = ["EURUSD", "GBPUSD", "XAUUSD"];
const syntheticList = ["STEP Index", "Volatility 75", "JUMP 50"];

// ================================
// Populate Menus
// ================================
const forexMenu = document.getElementById("forexMenu");
const syntheticMenu = document.getElementById("syntheticMenu");
const favBar = document.getElementById("favBar");

function populateMenus() {
  forexList.forEach(sym => {
    const opt = document.createElement("option");
    opt.value = sym;
    opt.textContent = sym;
    forexMenu.appendChild(opt);
  });

  syntheticList.forEach(sym => {
    const opt = document.createElement("option");
    opt.value = sym;
    opt.textContent = sym;
    syntheticMenu.appendChild(opt);
  });
}

populateMenus();

// ================================
// Handle Menu Selection
// ================================
function handleMenu(type) {
  favBar.innerHTML = "";
  selectedCategory = type;
  selectedInstrument = "";

  const list = type === "forex" ? forexList : syntheticList;

  if (list.length === 0) {
    favBar.innerHTML = `<span class="empty">Select instrument from menu above</span>`;
    return;
  }

  list.forEach(sym => {
    const div = document.createElement("div");
    div.className = "instrument";
    div.textContent = sym;

    div.onclick = () => {
      document
        .querySelectorAll(".instrument")
        .forEach(el => el.classList.remove("active"));

      div.classList.add("active");
      selectedInstrument = sym;

      console.log("Selected:", selectedInstrument);
    };

    favBar.appendChild(div);
  });
}

// ================================
// Trade Sender
// ================================
function sendTrade(action) {
  if (!selectedInstrument) {
    tg.showAlert("Please select an instrument first.");
    return;
  }

  const payload = {
    action: action,
    symbol: selectedInstrument,
    category: selectedCategory,
    time: Date.now()
  };

  console.log("Sending to MT5:", payload);
  tg.sendData(JSON.stringify(payload));
}
