import { CollectionConfig } from "payload/types";
import { createReviewedAt } from "./hooks/createReviewedAt";
import { createReviewer } from "./hooks/createReviewer";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  hooks: {
    beforeChange: [createReviewedAt, createReviewer],
  },
  fields: [
    {
      name: "application",
      type: "relationship",
      relationTo: "applications",
      required: true,
    },
    {
      name: "vendorScore",
      type: "number",
      required: true,
    },
    {
      name: "productScore",
      type: "number",
      required: true,
    },
    {
      name: "demographicScore",
      type: "number",
      required: true,
    },
    {
      name: "saturationScore",
      type: "number",
      required: true,
    },
    {
      name: "setupScore",
      type: "number",
      required: true,
    },
    {
      name: "attendanceScore",
      type: "number",
      required: true,
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        placeholder: "start typing...",
      },
    },
    {
      name: "reviewer",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "reviewedAt",
      type: "date",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "reviews",
      type: "relationship",
      relationTo: "markets",
      hasMany: true,
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
    },
  ],
};
