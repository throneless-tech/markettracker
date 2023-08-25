import { CollectionConfig } from "payload/types";

export const Days: CollectionConfig = {
  slug: "days",
  fields: [
    {
      name: "instance",
      type: "relationship",
      relationTo: "instances",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
  ],
};
