import { CollectionConfig } from "payload/types";

export const Documents: CollectionConfig = {
  slug: "documents",
  upload: {
    staticURL: "/documents",
    staticDir: "documents",
    mimeTypes: ["image/*", "application/pdf"],
  },
  fields: [
    {
      name: "expiration",
      label: "Expiration Date",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "MM/DD/YYYY",
        },
        description: "example 01/15/2023",
      },
    },
  ],
};
