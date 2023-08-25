import { CollectionConfig } from "payload/types";

export const Products: CollectionConfig = {
  slug: "products",
  fields: [
    {
      name: "product",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "text",
    },
  ],
};
