import { CollectionConfig } from "payload/types";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "product",
  },
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
