import { CollectionConfig } from "payload/types";
import { createCollectionDocument } from "./hooks/createCollectionDocument";
import { emptyProfileNotifications } from "./hooks/emptyProfileNotifications";

export const Documents: CollectionConfig = {
  slug: "documents",
  // hooks: {
  //   afterChange: [emptyProfileNotifications],
  // },
  upload: {
    staticURL: "/documents",
    staticDir: "documents",
    disableLocalStorage: true,
    // mimeTypes: ["image/*", "application/pdf"],
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
    {
      name: "type",
      label: "Document Type",
      type: "select",
      options: [
        {
          value: "license",
          label: "Business License",
        },
        {
          value: "insurance",
          label: "Business Insurance Documentation",
        },
      ],
    },
  ],
};
