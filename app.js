import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Parse JSON
app.use(bodyParser.json());

// Telegram WebApp sends POST data here
app.post("/telegram", (req, res) => {
  try {
    const data = req.body;

    console.log("📩 Telegram WebApp Data:", data);

    // Validate
    if (!data.action || !data.symbol) {
      return res.status(400).send("Invalid payload");
    }

    // Write to MT5 COMMON folder (adjust path if needed)
    fs.writeFileSync(
      "telegram_payload.json",
      JSON.stringify(data),
      "utf8"
    );

    console.log("✅ Payload written to telegram_payload.json");

    res.send("OK");
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
