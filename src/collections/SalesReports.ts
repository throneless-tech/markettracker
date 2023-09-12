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
      name: "market",
      type: "relationship",
      relationTo: "markets",
      hasMany: false,
      required: true,
    },
    {
      name: "day",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
        },
      },
    },
    {
      name: "cashAndCredit",
      label: "Cash & Credit Sales",
      type: "number",
      required: true,
      admin: {
        description: "Enter the sum total of Cash and Credit sales",
        placeholder: "$0",
      },
    },
    {
      name: "producePlus",
      label: "Produce Plus Sales",
      type: "number",
      required: true,
      admin: {
        description:
          "Enter the sum total of Produce Plus sales (only applies in DC)",
        placeholder: "$0",
      },
    },
    {
      name: "sfmnp",
      label: "SFMNP Sales",
      type: "number",
      required: true,
      admin: {
        description:
          "Enter the sum total of Seniors Farmers' Market Nutrition Program sales",
        placeholder: "$0",
      },
    },
    {
      name: "wic",
      label: "WIC Sales",
      type: "number",
      required: true,
      admin: {
        description:
          "Enter the sum total of Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) sales",
        placeholder: "$0",
      },
    },
  ],
};