let currentSymbol = "";

// BUTTON CLICK HANDLER
function sendTrade(action) {
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

// SIMPLE SYMBOL SELECTOR (TEMP)
function setSymbol(sym) {
  currentSymbol = sym;
  console.log("🎯 Symbol selected:", sym);
}
