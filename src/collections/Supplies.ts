import { CollectionConfig } from "payload/types";

export const Supplies: CollectionConfig = {
  slug: "supplies",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
