import { CollectionConfig } from "payload/types";

export const MarketReports: CollectionConfig = {
  slug: "market-reports",
  fields: [
    {
      name: "vendors",
      type: "relationship",
      relationTo: "vendors",
      hasMany: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "suppliesNeeded",
      type: "select",
      hasMany: true,
      options: [
        {
          label: "Tables",
          value: "tables",
        },
        {
          label: "Chairs",
          value: "chairs",
        },
      ],
    },
    {
      name: "customerAttendance",
      type: "number",
    },
    {
      name: "badWeather",
      type: "checkbox",
    },
    {
      name: "needsAttention",
      type: "checkbox",
    },
    {
      name: "actionItems",
      type: "text",
    },
    {
      name: "tasks",
      type: "text",
    },
    {
      name: "otherNotes",
      type: "text",
    },
  ],
};
