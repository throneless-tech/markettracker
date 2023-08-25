import { CollectionConfig } from "payload/types";

export const Invoices: CollectionConfig = {
  slug: "invoices",
  fields: [
    {
      name: "id",
      type: "text",
    },
    {
      name: "amount",
      type: "number",
    },
    {
      name: "paid",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "penalty",
      type: "number",
    },
    {
      name: "credit",
      type: "number",
    },
    {
      name: "reports",
      type: "relationship",
      relationTo: "sales-reports",
      hasMany: true,
    },
  ],
};
