import { CollectionConfig } from "payload/types";
import CustomProductsList from "../components/Products/CustomProductsList";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    components: {
      views: {
        // Edit: CustomProductsEdit,
        List: CustomProductsList,
      },
    },
    useAsTitle: "name",
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
