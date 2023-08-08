import { CollectionConfig } from "payload/types";

export const Days: CollectionConfig = {
  slug: "days",
  fields: [
    {
      name: "instance",
      type: "relationship",
      relationTo: "instance",
      required: true,
    },
    {
      name: "date",
      type: "date",
      required: true,
    },
  ],
};
