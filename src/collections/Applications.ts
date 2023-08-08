import { CollectionConfig } from "payload/types";

export const Applications: CollectionConfig = {
  slug: "applications",
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      hasMany: false,
    },
    {
      name: "market",
      type: "relationship",
      relationTo: "markets",
      hasMany: false,
    },
    {
      name: "state",
      type: "select",
      options: [
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Rejected",
          value: "rejected",
        },
        {
          label: "Pending",
          value: "pending",
        },
      ],
    },
  ],
};
