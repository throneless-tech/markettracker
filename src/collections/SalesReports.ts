import { CollectionConfig } from "payload/types";

export const SalesReports: CollectionConfig = {
  slug: "sales-reports",
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      hasMany: false,
      required: true,
    },
    {
      name: "day",
      type: "relationship",
      relationTo: "days",
      hasMany: false,
      required: true,
    },
    {
      name: "amount",
      type: "number",
    },
  ],
};
