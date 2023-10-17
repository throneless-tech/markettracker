import { CollectionConfig } from "payload/types";
import { ProductsList } from "../components/Products/List";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    components: {
      views: {
        // Edit: CustomProductsEdit,
        List: ProductsList,
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
      type: "select",
      required: true,
      options: [
        {
          value: "meat",
          label: "Meat",
        },
        {
          value: "dairy",
          label: "Dairy",
        },
        {
          value: "produce",
          label: "Produce",
        },
        {
          value: "plants",
          label: "Plants",
        },
        {
          value: "dried_goods",
          label: "Dried Goods",
        },
        {
          value: "value_added_products",
          label: "Value-Added Products",
        },
        {
          value: "baked_goods",
          label: "Baked Goods",
        },
        {
          value: "prepared_food",
          label: "Prepared Food",
        },
        {
          value: "beverages",
          label: "Beverages",
        },
        {
          value: "non_food",
          label: "Non-Food",
        },
      ],
    },
  ],
};
