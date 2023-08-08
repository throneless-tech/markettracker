import { CollectionConfig } from "payload/types";

export const Vendors = {
  slug: "vendors",
  fields: [
    {
      name: "name",
      type: "string",
      required: true,
    },
    {
      name: "contacts",
      type: "relationship",
      relationTo: ["users", "contacts"],
      hasMany: true,
    },
    {
      name: "reports",
      type: "relationship",
      relationTo: "sales-reports",
      hasMany: true,
    },
    {
      name: "appointments",
      type: "relationship",
      relationTo: "appointments",
      hasMany: true,
    },
    {
      name: "applications",
      type: "relationship",
      relationTo: "applications",
      hasMany: true,
    },
  ],
};
