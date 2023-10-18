import { CollectionConfig } from "payload/types";
//import { createReviewedAt } from "./hooks/createReviewedAt";
import { createReviewer } from "./hooks/createReviewer";
import { withFormContext } from "../../utils/withFormContext";
import {
  afterReadApplication,
  beforeValidateApplication,
} from "./hooks/populateApplication";
import ReviewEdit from "../../components/Reviews/ReviewEdit";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  hooks: {
    afterRead: [afterReadApplication],
    beforeChange: [createReviewer],
    beforeValidate: [beforeValidateApplication],
  },
  admin: {
    components: {
      views: {
        Edit: withFormContext(ReviewEdit),
      },
    },
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
      defaultValue: 0,
      required: true,
    },
    {
      name: "productScore",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "demographicScore",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "saturationScore",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "setupScore",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "attendanceScore",
      type: "number",
      defaultValue: 0,
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
    // {
    //   name: "status",
    //   type: "select",
    //   defaultValue: "pending",
    //   options: [
    //     {
    //       label: "Approved",
    //       value: "approved",
    //     },
    //     {
    //       label: "Rejected",
    //       value: "rejected",
    //     },
    //     {
    //       label: "Pending",
    //       value: "pending",
    //     },
    //   ],
    // },
  ],
};
