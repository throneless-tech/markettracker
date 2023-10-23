import { CollectionConfig } from "payload/types";
import { createFieldVendor } from "./hooks/createFieldVendor";
import { afterReadMarket, beforeValidateMarket } from "./hooks/populateMarket";
import { afterReadVendor, beforeValidateVendor } from "./hooks/populateVendor";
import {
  afterReadProducts,
  beforeValidateProducts,
} from "./hooks/populateProducts";
import { ApplicationsEdit } from "../../components/Applications/ApplicationsEdit";
import { ApplicationsList } from "../../components/Applications/ApplicationsList";
import { withFormContext } from "../../utils/withFormContext";

export const Applications: CollectionConfig = {
  slug: "applications",
  admin: {
    components: {
      views: {
        Edit: withFormContext(ApplicationsEdit),
        List: ApplicationsList,
      },
    },
    pagination: {
      defaultLimit: 9999,
    },
    useAsTitle: "name",
  },
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      //required: true,
      access: {
        create: ({ req }) => req.user.role !== "vendor",
        update: ({ req }) => req.user.role !== "vendor",
      },
      hooks: {
        beforeChange: [createFieldVendor],
      },
    },
    {
      name: "season",
      type: "relationship",
      relationTo: "seasons",
      //required: true,
      // access: {
      //   update: ({ req }) => req.user.role !== "vendor",
      // },
    },
    {
      name: "reviews",
      type: "relationship",
      relationTo: "reviews",
      hasMany: true,
      access: {
        create: () => false,
        read: ({ req }) => req.user.role !== "vendor",
        update: ({ req }) => req.user.role !== "vendor",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Rejected",
          value: "rejected",
        },
        {
          label: "Pending",
          value: "pending",
        },
      ],
      access: {
        create: ({ req }) => req.user.role !== "vendor",
        update: ({ req }) => req.user.role !== "vendor",
      },
    },
    {
      name: "dates",
      label: "Market Dates",
      type: "array",
      required: true,
      fields: [
        {
          name: "date",
          type: "date",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
      ],
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "isCSA",
      label:
        "Do you intend to sell and coordinate CSA share pickups at the market?",
      type: "checkbox",
    },
    {
      name: "staff",
      type: "relationship",
      relationTo: "contacts",
      hasMany: true,
    },
  ],
  hooks: {
    afterRead: [afterReadMarket, afterReadVendor, afterReadProducts],
    beforeValidate: [
      beforeValidateMarket,
      beforeValidateVendor,
      beforeValidateProducts,
    ],
  },
};
