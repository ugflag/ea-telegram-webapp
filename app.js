let currentSymbol = "";

// TEMP DEFAULT (for testing)
// Remove later
currentSymbol = "Volatility 100 (1s) Index";

/* ===============================
   TELEGRAM BUTTON HANDLER
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

  console.log("📤 Sending to Telegram:", payload);

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(payload));
  } else {
    alert("Telegram WebApp not detected");
  }
}

/* ===============================
   REQUIRED TELEGRAM INIT
================================ */
window.onload = () => {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    console.log("✅ Telegram WebApp ready");
  } else {
    console.log("⚠ Not running inside Telegram");
  }
};
