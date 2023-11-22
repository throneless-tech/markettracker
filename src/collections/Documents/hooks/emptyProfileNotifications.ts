import payload from "payload";
import csv from "csvtojson";
import { readFile } from "fs/promises";
import { CollectionAfterChangeHook } from "payload/types";

type VendorSource = {
  email: string;
};

export const emptyProfileNotifications: CollectionAfterChangeHook = async (
  props,
) => {
  const { doc, req, operation } = props;

  if (operation === "create" && req.files.file.mimetype === "text/csv") {
    console.log(`Found csv file ${req.files.file.name}!`);
    let content: string;
    if (req.files.file.tempFilePath) {
      content = (await readFile(req.files.file.tempFilePath)).toString();
    } else {
      content = req.files.file.data.toString();
    }
    csv()
      .fromString(content)
      .then(async (fromCSV: any) => {
        console.log("***fromCSV***", fromCSV);
        if (req.files.file.name === "notify.csv") {
          console.log("Processing notify.csv");

          fromCSV.forEach((source: VendorSource) => {
            console.log("Notifying:", source.email);
            payload.sendEmail({
              from: "cms@markettracker.payloadcms.app",
              to: source.email,
              subject: "Please fill out your Markettracker Vendor Profile",
              text: "Hello! This is an automated notification that there is missing information in your vendor profile on FreshFarm's Markettracker. During this beta period, it's possible that information from your vendor application wasn't saved correctly. If so, please visit https://markettracker.payloadcms.app and go to the 'My Profile' page to correct the information. Thank you so much for your patience, and hope you have a wonderful day!",
            });
          });
        }
      });
  }
  return doc;
};
