import type { GlobalConfig } from "payload/types";

export const Settings: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "fees",
      label: "Default market fee schedule",
      type: "array",
      fields: [
        {
          name: "fee",
          type: "group",
          label: "Market fee",
          fields: [
            {
              name: "label",
              type: "text",
              label: "Label",
            },
            {
              name: "percentage",
              type: "number",
              label: "Percentage",
            },
            {
              name: "type",
              type: "select",
              options: ["farmer", "producer"],
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    name: "Settings",
  },
  slug: "settings",
  typescript: {
    interface: "Settings",
  },
};
