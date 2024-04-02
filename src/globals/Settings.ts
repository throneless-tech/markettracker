import type { GlobalConfig } from "payload/types";

export const Settings: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "fees",
      label: "Default market fee schedule",
      type: "group",
      fields: [
        {
          name: "farm",
          type: "number",
        },
        {
          name: "farmProducer",
          type: "number",
        },
        {
          name: "farmConcessionaire",
          type: "number",
        },
        {
          name: "nonFarmProducer",
          type: "number",
        },
        {
          name: "concessionaire",
          type: "number",
        },
        {
          name: "farmSourcedAlcohol",
          type: "number",
        },
        {
          name: "coffeeExceptions",
          type: "number",
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
