import { CollectionConfig } from "payload/types";
import { createFieldVendor } from "./hooks/createFieldVendor";
import CustomApplicationsEdit from "../../components/Applications/CustomApplicationsEdit";
import CustomApplicationsList from "../../components/Applications/CustomApplicationsList";
import { withFormContext } from "../../utils/withFormContext";

export const Applications: CollectionConfig = {
  slug: "applications",
  admin: {
    components: {
      views: {
        Edit: withFormContext(CustomApplicationsEdit),
        List: CustomApplicationsList,
      },
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
      access: {
        update: ({ req }) => req.user.role !== "vendor",
      },
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
};
