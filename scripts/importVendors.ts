import dotenv from "dotenv";
import path from "path";
import csv from "csvtojson";
import humanparser from "humanparser";
import payload from "payload";
import { Contact, User, Vendor } from "../src/payload-types";

const REMOVE_EXISTING = true;

type VendorSource = {
  Vendor: string;
  Farm: string;
  "Owner Name": string;
  "Primary Email": string;
  POC: string;
  "Approved Products": string;
  Address: string;
  Phone: string;
  "Company Description": string;
  "Year Established": string;
};

dotenv.config();

(async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "",
    mongoURL: process.env.MONGODB_URI || "",
    local: true,
  });
  let userCount = 0;
  let contactCount = 0;
  let vendorCount = 0;
  const vendorsSource: { [key: string]: VendorSource } = {};
  const csvPath = path.resolve(__dirname, "../vendors.csv");
  csv()
    .fromFile(csvPath)
    .then(async (fromCSV: any) => {
      fromCSV.forEach((source: VendorSource) => {
        vendorsSource[source["Primary Email"]] = source;
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(vendorsSource)) {
        const source = vendorsSource[key];

        const userData: Omit<User, "id" | "createdAt" | "updatedAt"> = {
          name: source["Owner Name"] || source.POC,
          email: source["Primary Email"] || "null@example.com",
          role: "vendor",
          password: "dummyPassword",
        };
        console.log("userData:", userData);
        let user: User;
        try {
          // eslint-disable-next-line no-await-in-loop
          user = await payload.create({
            collection: "users",
            overrideAccess: true,
            disableVerificationEmail: true,
            data: userData,
          });
          console.log("created user: ", user);
          userCount += 1;
        } catch (e) {
          console.log(e);
          // eslint-disable-next-line no-continue
          console.log("skip user: ", userData.email);
          // eslint-disable-next-line no-continue
        }
        const contactData: Omit<Contact, "id" | "createdAt" | "updatedAt"> = {
          name: user.name,
          email: user.email,
          phone: source.Phone,
          type: ["primary"],
        };
        let contact: Contact;
        try {
          // eslint-disable-next-line no-await-in-loop
          contact = await payload.create({
            collection: "contacts",
            overrideAccess: true,
            data: contactData,
          });
          console.log("created contact: ", contact);
          contactCount += 1;
        } catch (e) {
          console.log(e);
          console.log("skip contact: ", contactData.email);
        }

        const address = humanparser.parseAddress(source.Address);
        const data: Omit<Vendor, "id" | "createdAt" | "updatedAt"> = {
          name: source.Vendor,
          user: user.id,
          isPrimaryContact: true,
          isBillingContact: false,
          address: {
            street: address.address,
            city: address.city,
            state: address.state,
            zipcode: address.zip,
          },
          type: source.Farm === "YES" ? "farmer" : "other",
          phoneNumber: source.Phone,
          isSeparateBilling: false,
          description: source["Company Description"] || "None",
          contacts: [contact.id],
        };
        let vendor;
        try {
          // eslint-disable-next-line no-await-in-loop
          vendor = await payload.create({
            collection: "vendors",
            overrideAccess: true,
            data,
          });
          console.log("created vendor: ", vendor);
          vendorCount += 1;
        } catch (e) {
          console.log(e);
          // eslint-disable-next-line no-continue
          console.log("skip vendor: ", data.name);
          // eslint-disable-next-line no-continue
        }

        console.log("DONE");
      }
      console.log("userCount:", userCount);
      console.log("contactCount:", contactCount);
      console.log("vendorCount:", vendorCount);
      console.log("records length:", vendorsSource.size);
    })
    .then(() => process.exit(0));
})();
