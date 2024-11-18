import express from "express";
import payload from "payload";
import path from "path";
import nodemailer from 'nodemailer';

require("dotenv").config();
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Serve images
app.use("/assets", express.static(path.resolve(__dirname, "./assets")));

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

// set up email capabilities
const transport = async () => {
  const transport = await nodemailer.createTransport({
    apiKey: process.env.RESEND_API_KEY,
  })
};

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  express: app,
  email: {
    fromName: 'FreshFarm MarketTracker',
    fromAddress: 'no-reply@markettracker.payloadcms.app',
    transport,
  },
  loggerOptions: { level: "debug" },
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here

app.listen(3000);
