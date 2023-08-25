import { CollectionConfig } from "payload/types";

export const Instances: CollectionConfig = {
  slug: "instances",
  fields: [
    {
      name: "timeOfYear",
      label: "Time of Year",
      type: "group",
      fields: [
        {
          name: "season",
          type: "select",
          hasMany: false,
          options: [
            {
              label: "Spring",
              value: "spring",
            },
            {
              label: "Summer",
              value: "summer",
            },
            {
              label: "Fall",
              value: "fall",
            },
            {
              label: "Winter",
              value: "winter",
            },
          ],
        },
        {
          name: "year",
          label: "Year",
          type: "number",
        },
      ],
    },
    {
      name: "market",
      label: "Market",
      type: "relationship",
      relationTo: "markets",
    },
  ],
};
