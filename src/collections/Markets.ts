import { CollectionConfig } from "payload/types";

export const Markets: CollectionConfig = {
  slug: "markets",
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
