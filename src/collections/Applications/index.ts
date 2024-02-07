import { CollectionConfig } from "payload/types";
import { createFieldVendor } from "./hooks/createFieldVendor";
import { afterReadMarket, beforeValidateMarket } from "./hooks/populateMarket";
import { afterReadVendor, beforeValidateVendor } from "./hooks/populateVendor";
import {
  afterReadProducts,
  beforeValidateProducts,
} from "./hooks/populateProducts";
import { afterReadStats } from "./hooks/populateStats";
import { ApplicationsEdit } from "../../components/Applications/ApplicationsEdit";
import { ApplicationsList } from "../../components/Applications/ApplicationsList";
import { withFormContext } from "../../utils/withFormContext";

export const Applications: CollectionConfig = {
  slug: "applications",
  defaultSort: "createdAt",
  admin: {
    components: {
      views: {
        Edit: withFormContext(ApplicationsEdit),
        List: ApplicationsList,
      },
    },
    useAsTitle: "name",
    pagination: {
      defaultLimit: 10,
    },
  },
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      index: true,
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
      index: true,
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
          label: "Approved with edits",
          value: "approvedWithEdits",
        },
        {
          label: "Tentatively approved",
          value: "tentativelyApproved",
        },
        {
          label: "Tentatively rejected",
          value: "tentativelyRejected",
        },
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Withdrawn",
          value: "withdrawn",
        },
      ],
      access: {
        create: ({ req }) => req.user.role !== "vendor",
        update: ({ req }) => req.user.role !== "vendor",
      },
    },
    {
      name: "schedule",
      type: "select",
      options: [
        {
          label: "Fulltime",
          value: "fulltime",
        },
        {
          label: "Parttime",
          value: "parttime",
        },
        {
          label: "Popup",
          value: "popup",
        },
      ],
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
    {
      name: "numberOfMarkets",
      type: "number",
    },
    // {
    //   name: "reviewScore",
    //   type: "number",
    // },
    {
      name: "vendorName",
      type: "text",
    },
    {
      name: "seasonName",
      type: "text",
    },
    {
      name: "vendorType",
      type: "text",
    },
    {
      name: "vendorStanding",
      type: "text",
    },
  ],
  hooks: {
    afterRead: [afterReadStats],
    beforeValidate: [
      beforeValidateMarket,
      beforeValidateVendor,
      beforeValidateProducts,
    ],
  },
};
