import { CollectionConfig } from "payload/types";
import CustomMarketsEdit from "../components/Markets/CustomMarketsEdit";
import CustomMarketsList from "../components/Markets/CustomMarketsList";

export const Markets: CollectionConfig = {
  slug: "markets",
  admin: {
    components: {
      views: {
        Edit: CustomMarketsEdit,
        List: CustomMarketsList,
      },
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "contact",
      type: "relationship",
      relationTo: "contacts",
    },
    {
      name: "state",
      type: "select",
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        },
      ],
    },
  ],
};
