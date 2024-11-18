import express from "express";
import payload from "payload";
import path from "path";
import { Resend } from 'resend';
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

const fromName = 'FreshFarm MarketTracker';
const fromAddress = 'no-reply@markettracker.payloadcms.app';

const transportConfig = {
  send: async (mail, callback) => {
    const { from, to, subject, html, text } = mail.data

    if (!to) return callback(new Error('No "to" address provided'), null)

    if (!from) return callback(new Error('No "from" address provided'), null)

    const cleanTo = []
    const toArr = Array.isArray(to) ? to : [to]

    toArr.forEach(toItem => {
      if (typeof toItem === 'string') {
        cleanTo.push(toItem)
      } else {
        cleanTo.push(toItem.address)
      }
    })

    let fromToUse

    if (typeof from === 'string') {
      fromToUse = from
    } else if (typeof from === 'object' && 'name' in from && 'address' in from) {
      fromToUse = `${from.name} <${from.address}>`
    } else {
      fromToUse = `${fromName} <${fromAddress}>`
    }

    // Parse domain. Can be in 2 possible formats:  "name@domain.com" or "Friendly Name <name@domain.com>"
    const domainMatch = fromToUse.match(/(?<=@)[^(\s|>)]+/g)

    if (!domainMatch) {
      return callback(new Error(`Could not parse domain from "from" address: ${fromToUse}`), null)
    }

    const resend = new Resend(process.env.apiKey);

    if (!resend) {
      callback(
        new Error(
          `No Resend instance found for domain: markettracker.payloadcms.app.`,
        ),
        null,
      )
    }

    try {
      const sendResponse = await resend.emails.send({
        from: fromToUse,
        to: cleanTo,
        subject: subject || '<No subject>',
        html: (html || text),
      })

      if ('error' in sendResponse) {
        return callback(new Error('Error sending email', { cause: sendResponse.error }), null)
      }
      return callback(null, sendResponse)
    } catch (err) {
      if (isResendError(err)) {
        return callback(
          new Error(`Error sending email: ${err.statusCode} ${err.name}: ${err.message}`),
          null,
        )
      } else if (err instanceof Error) {
        return callback(
          new Error(`Unexpected error sending email: ${err.message}: ${err.stack}`),
          null,
        )
      } else {
        return callback(new Error(`Unexpected error sending email: ${err}`), null)
      }
    }
  },
}

function isResendError(err) {
  return Boolean(
    err && typeof err === 'object' && 'message' in err && 'statusCode' in err && 'name' in err,
  )
}


const transport = nodemailer.createTransport({ transportConfig });

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
