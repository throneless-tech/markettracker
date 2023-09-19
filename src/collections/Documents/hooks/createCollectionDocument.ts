import payload from "payload";
import csv from "csvtojson";
import humanparser from "humanparser";
import { readFile } from "fs/promises";
import { CollectionAfterChangeHook } from "payload/types";
import {
  Contact,
  Market,
  Product,
  Season,
  User,
  Vendor,
} from "../../../payload-types";

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

type MarketSource = {
  "Market Name": string;
  Address: string;
  "Day of the Week": string;
  "Hours (2024 Winter Season)": string;
  "Dates (2024 Winter Season)": string;
  Size: string;
  Focus: string;
};

type ProductSource = {
  category: string;
  product: string;
};

export const createCollectionDocument: CollectionAfterChangeHook = async (
  props,
) => {
  const { doc, req, operation } = props;

  if (
    operation === "create" && req.files.file.mimetype === "text/csv"
  ) {
    console.log("Found csv file!");
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
        if (req.files.file.name === "vendors.csv") {
          console.log("Processing vendors.csv");
          let userCount = 0;
          let contactCount = 0;
          let vendorCount = 0;
          const vendorsSource: { [key: string]: VendorSource } = {};
          fromCSV.forEach((source: VendorSource) => {
            vendorsSource[source["Primary Email"]] = source;
          });
          // eslint-disable-next-line no-restricted-syntax
          for (const key of Object.keys(vendorsSource)) {
            const source = vendorsSource[key];

            // USERS
            const userData: Omit<User, "id" | "createdAt" | "updatedAt"> = {
              name: source["Owner Name"] || source.POC,
              email: source["Primary Email"] || "null@example.com",
              role: "vendor",
              password: Math.random().toString(36).slice(2),
            };
            let user: User;
            try {
              const { docs } = await payload.find({
                collection: "users",
                where: {
                  email: {
                    equals: userData.email.toLowerCase(),
                  },
                },
              });
              if (docs.length > 0) {
                user = docs[0];
                console.log("found user: ", user);
              } else {
                user = await payload.create({
                  collection: "users",
                  overrideAccess: true,
                  disableVerificationEmail: true,
                  user: req.user,
                  data: userData,
                });
                console.log("created user: ", user);
                userCount += 1;
              }
            } catch (e) {
              console.log(e);
              // eslint-disable-next-line no-continue
              console.log("skip user: ", userData.email);
              // eslint-disable-next-line no-continue
            }

            // CONTACTS
            const contactData: Omit<Contact, "id" | "createdAt" | "updatedAt"> =
              {
                name: user.name,
                email: user.email,
                phone: source.Phone,
                type: ["primary"],
              };
            let contact: Contact;
            try {
              const { docs } = await payload.find({
                collection: "contacts",
                where: {
                  email: {
                    equals: contactData.email.toLowerCase(),
                  },
                },
              });
              if (docs.length > 0) {
                contact = docs[0];
                console.log("found contact: ", user);
              } else {
                contact = await payload.create({
                  collection: "contacts",
                  overrideAccess: true,
                  data: contactData,
                });
                console.log("created contact: ", contact);
                contactCount += 1;
              }
            } catch (e) {
              console.log(e);
              console.log("skip contact: ", contactData.email);
            }

            // VENDORS
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
            let vendor: Vendor;
            try {
              const { docs } = await payload.find({
                collection: "vendors",
                where: {
                  name: {
                    equals: source.Vendor,
                  },
                },
              });
              if (docs.length > 0) {
                vendor = docs[0];
                console.log("found vendor: ", user);
              } else {
                vendor = await payload.create({
                  collection: "vendors",
                  overrideAccess: true,
                  data,
                });
                console.log("created vendor: ", vendor);
                vendorCount += 1;
              }
              await payload.update({
                collection: "users",
                id: user.id,
                user: req.user,
                data: {
                  vendor: vendor.id,
                },
              });
            } catch (e) {
              console.log(e);
              console.log("skip vendor: ", data.name);
            }
          }
          console.log("Import Done!");
          console.log("Rows processed:", Object.keys(vendorsSource).length);
          console.log("New users created:", userCount);
          console.log("New contacts created:", contactCount);
          console.log("New vendors created:", vendorCount);
        } else if (req.files.file.name === "markets.csv") {
          console.log("Processing markets.csv");
          let marketCount = 0;
          let seasonCount = 0;
          const marketSource: { [key: string]: MarketSource } = {};

          fromCSV.forEach((source: MarketSource) => {
            marketSource[source["Market Name"]] = source;
          });

          for (const key of Object.keys(marketSource)) {
            const source = marketSource[key];

            // MARKETS
            const address = humanparser.parseAddress(source.Address);
            const marketData: Omit<Market, "id" | "createdAt" | "updatedAt"> = {
              name: source["Market Name"],
              address: {
                street: address.address,
                city: address.city,
                state: address.state,
                zipcode: address.zip,
              },
              days: [source["Day of the Week"].toLowerCase()] as ["sunday"],
              focus: source.Focus.toLowerCase() as any,
              size: source.Size.toLowerCase() as any,
            };
            let market: Market;
            try {
              const { docs } = await payload.find({
                collection: "markets",
                where: {
                  name: {
                    equals: marketData.name,
                  },
                },
              });
              if (docs.length > 0) {
                market = docs[0];
                console.log("found market: ", market);
              } else {
                market = await payload.create({
                  collection: "markets",
                  overrideAccess: true,
                  disableVerificationEmail: true,
                  user: req.user,
                  data: marketData,
                });
                console.log("created market: ", market);
                marketCount += 1;
              }
            } catch (e) {
              console.log(e);
              console.log("skip market: ", marketData.name);
            }

            // SEASONS
            // const seasonData: Omit<Season, "id" | "createdAt" | "updatedAt"> = {
            //   name: source["Owner Name"] || source.POC,
            //   email: source["Primary Email"] || "null@example.com",
            //   role: "vendor",
            //   password: Math.random().toString(36).slice(2),
            // };
            // let season: Season;
            // try {
            //   const { docs } = await payload.find({
            //     collection: "users",
            //     where: {
            //       email: {
            //         equals: seasonData.email.toLowerCase(),
            //       },
            //     },
            //   });
            //   if (docs.length > 0) {
            //     season = docs[0];
            //     console.log("found season: ", season);
            //   } else {
            //     season = await payload.create({
            //       collection: "users",
            //       overrideAccess: true,
            //       disableVerificationEmail: true,
            //       user: req.user,
            //       data: seasonData,
            //     });
            //     console.log("created season: ", season);
            //     seasonCount += 1;
            //   }
            // } catch (e) {
            //   console.log(e);
            //   // eslint-disable-next-line no-continue
            //   console.log("skip season: ", seasonData.email);
            //   // eslint-disable-next-line no-continue
          }
          console.log("Import Done!");
          console.log("Rows processed:", Object.keys(marketSource).length);
          console.log("New markets created:", marketCount);
          console.log("New seasons created:", seasonCount);
        } else if (req.files.file.name === "products.csv") {
          console.log("Processing products.csv");
          let productCount = 0;
          const productSource: { [key: string]: ProductSource } = {};

          fromCSV.forEach((source: ProductSource) => {
            productSource[source.product] = source;
          });

          for (const key of Object.keys(productSource)) {
            const source = productSource[key];

            // PRODUCTS
            const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> =
              {
                product: source.product,
                category: source.category,
              };
            let product: Product;
            try {
              const { docs } = await payload.find({
                collection: "products",
                where: {
                  product: {
                    equals: productData.product,
                  },
                },
              });
              if (docs.length > 0) {
                product = docs[0];
                console.log("found product: ", product);
              } else {
                product = await payload.create({
                  collection: "products",
                  overrideAccess: true,
                  disableVerificationEmail: true,
                  user: req.user,
                  data: productData,
                });
                console.log("created product: ", product);
                productCount += 1;
              }
            } catch (e) {
              console.log(e);
              console.log("skip product: ", productData.product);
            }
          }
          console.log("Import Done!");
          console.log("Rows processed:", Object.keys(productSource).length);
          console.log("New products created:", productCount);
        }
      });
  }
  return doc;
};
