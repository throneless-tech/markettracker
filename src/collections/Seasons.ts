import { CollectionConfig } from "payload/types";

export const Seasons: CollectionConfig = {
  slug: "seasons",
  fields: [
    {
      name: "isAccepting",
      label: "Accepting Applications",
      type: "checkbox",
    },
    {
      name: "marketDates",
      label: "Market Dates",
      type: "group",
      fields: [
        {
          name: "startDate",
          label: "Start date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
        {
          name: "endDate",
          label: "End date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
      ],
      admin: {
        description: "Select a start and end date for the season",
      },
    },
    {
      name: "productGaps",
      label: "Product Gaps",
      type: "text", // TODO placeholder for custom field
      admin: {
        description: "Check All Products Desired at market",
      },
    },
    {
      name: "market",
      label: "Market",
      type: "relationship",
      relationTo: "markets",
      required: true,
    },
  ],
};
