import { CollectionConfig } from "payload/types";
import { createCollectionDocument } from "./hooks/createCollectionDocument";

export const Documents: CollectionConfig = {
  slug: "documents",
  hooks: {
    afterChange: [createCollectionDocument],
  },
  upload: {
    staticURL: "/documents",
    staticDir: "documents",
    //mimeTypes: ["image/*", "application/pdf"],
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
          displayFormat: "MM/dd/yyyy",
        },
        description: "example 01/15/2023",
      },
    },
  ],
};
