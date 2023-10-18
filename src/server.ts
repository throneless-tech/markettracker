import express from "express";
import payload from "payload";
import path from "path";

require("dotenv").config();
const app = express();

// Serve images
app.use("/assets", express.static(path.resolve(__dirname, "./assets")));

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  loggerOptions: { level: "debug" },
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
  email: {
    fromName: "FreshFarm Market Tracker",
    fromAddress: "cms@markettracker.payloadcms.app",
  },
});

// Add your own express routes here

app.listen(3000);
