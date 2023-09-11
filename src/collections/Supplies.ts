import { CollectionConfig } from "payload/types";

export const Supplies: CollectionConfig = {
  slug: "supplies",
  fields: [
    {
      name: "supply",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "text",
    },
  ],
};
