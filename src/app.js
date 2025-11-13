const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from ETE_Televerse_Scenario_2!" });
});

app.get("/health", (req, res) => {
  // return 200 OK and some basic metadata
  res.json({
    status: "UP",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

module.exports = app;
