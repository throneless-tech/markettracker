import { CollectionConfig } from "payload/types";

export const Appointments: CollectionConfig = {
  slug: "appointments",
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      hasMany: false,
    },
    {
      name: "day",
      type: "relationship",
      relationTo: "days",
      hasMany: false,
    },
  ],
};
