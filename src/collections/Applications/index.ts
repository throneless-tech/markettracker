import { CollectionConfig } from "payload/types";
import { createFieldVendor } from "./hooks/createFieldVendor";

export const Applications: CollectionConfig = {
  slug: "applications",
  fields: [
    {
      name: "vendor",
      type: "relationship",
      relationTo: "vendors",
      required: true,
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
      required: true,
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
  ],
};
