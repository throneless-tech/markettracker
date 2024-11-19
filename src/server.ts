import express from "express";
import payload from "payload";
import path from "path";
// import { Resend } from 'resend';
import nodemailer from "nodemailer";

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

const fromName = process.env.RESEND_FROM_NAME;
const fromAddress = process.env.RESEND_FROM_ADDRESS;

const transport = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  express: app,
  email: {
    fromName: fromName,
    fromAddress: fromAddress,
    transport,
  },
  loggerOptions: { level: "debug" },
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
  },
});

// Add your own express routes here

app.listen(3000);
