const tg = window.Telegram.WebApp;
tg.ready();

let selectedInstrument = "";
let selectedType = "";

const forexList = [
  "EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "XAGUSD"
];

const syntheticList = [
  "Boom 1000 Index",
  "Crash 1000 Index",
  "Jump 100 Index",
  "Volatility 75 Index"
];

const instrumentRow = document.getElementById("instrumentRow");

document.getElementById("btnForex").onclick = () => loadInstruments("FOREX");
document.getElementById("btnSynthetic").onclick = () => loadInstruments("SYNTHETIC");

function loadInstruments(type) {
  selectedType = type;
  instrumentRow.innerHTML = "";

  const list = type === "FOREX" ? forexList : syntheticList;

  list.forEach(sym => {
    const btn = document.createElement("button");
    btn.textContent = sym;
    btn.onclick = () => selectInstrument(btn, sym);
    instrumentRow.appendChild(btn);
  });
}

function selectInstrument(btn, symbol) {
  selectedInstrument = symbol;

  document.querySelectorAll("#instrumentRow button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

function sendAction(action) {
  if (!selectedInstrument && action !== "CONTACT" && action !== "JOIN") {
    tg.showAlert("Select an instrument first");
    return;
  }

  const payload = {
    action: action,
    instrument: selectedInstrument,
    type: selectedType,
    time: Math.floor(Date.now() / 1000)
  };

  console.log("Sending:", payload);
  tg.sendData(JSON.stringify(payload));
}
