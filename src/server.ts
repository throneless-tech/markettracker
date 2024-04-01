import express from "express";
import payload from "payload";
import path from "path";

require("dotenv").config();
const app = express();

// Parse JSON request bodies
app.use(express.json());

app.get("*", (req, res) => {
  res.redirect(301, "https://markettracker.freshfarm.org" + req.path);
});

// // Serve images
// app.use("/assets", express.static(path.resolve(__dirname, "./assets")));

// // Redirect root to Admin panel
// app.get("/", (_, res) => {
//   res.redirect("/admin");
// });

// // Initialize Payload
// payload.init({
//   secret: process.env.PAYLOAD_SECRET,
//   express: app,
//   loggerOptions: { level: "debug" },
//   onInit: () => {
//     payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
//   },
// });

// Add your own express routes here

app.listen(3000);
