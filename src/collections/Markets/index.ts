import { CollectionConfig } from "payload/types";
import { withFormContext } from "../../utils/withFormContext";
import { MarketsEdit } from "../../components/Markets/MarketsEdit";
import { MarketsList } from "../../components/Markets/MarketsList";
import {
  afterReadSeasons,
  beforeValidateSeasons,
} from "./hooks/populateSeasons";

export const Markets: CollectionConfig = {
  slug: "markets",
  access: {
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  admin: {
    components: {
      views: {
        Edit: withFormContext(MarketsEdit),
        // List: MarketsList,
      },
    },
    pagination: {
      defaultLimit: 20,
    },
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "Market Name",
      type: "text",
      required: true,
      admin: {
        placeholder: "name",
      },
    },
    {
      name: "address",
      label: "Market Address",
      type: "group",
      fields: [
        {
          name: "street",
          label: "Street",
          type: "text",
          required: true,
        },
        {
          type: "row",
          fields: [
            {
              name: "city",
              label: "City",
              type: "text",
              required: true,
            },
            {
              name: "state",
              label: "State",
              type: "text",
              required: true,
            },
            {
              name: "zipcode",
              label: "Zipcode",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "contact",
      label: "Market Operator",
      type: "relationship",
      relationTo: "contacts",
      //required: true, //temporarily disabled for data import
    },
    {
      name: "days",
      label: "Market Day",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        {
          label: "Sunday",
          value: "sunday",
        },
        {
          label: "Monday",
          value: "monday",
        },
        {
          label: "Tuesday",
          value: "tuesday",
        },
        {
          label: "Wednesday",
          value: "wednesday",
        },
        {
          label: "Thursday",
          value: "thursday",
        },
        {
          label: "Friday",
          value: "friday",
        },
        {
          label: "Saturday",
          value: "saturday",
        },
      ],
    },
    {
      name: "size",
      label: "What size is the market?",
      type: "radio",
      options: [
        {
          label: "Flagship",
          value: "flagship",
        },
        {
          label: "Large",
          value: "large",
        },
        {
          label: "Medium",
          value: "medium",
        },
        {
          label: "Small",
          value: "small",
        },
        {
          label: "Farm Stand",
          value: "stand",
        },
      ],
    },
    {
      name: "visitors",
      label: "Visitors",
      type: "number",
    },
    {
      name: "focus",
      label: "Market Focus",
      type: "select",
      hasMany: true,
      options: [
        {
          label: "neighborhood",
          value: "neighborhood",
        },
        {
          label: "downtown",
          value: "downtown",
        },
        {
          label: "grocery shopping",
          value: "grocery",
        },
        {
          label: "prepared food shopping",
          value: "prepared",
        },
      ],
      admin: {
        description: "Check all that apply",
      },
    },
    {
      name: "description",
      label: "Brief Market Description",
      type: "textarea",
      //required: true, //temporarily disabled for data import
      admin: {
        placeholder: "start typing...",
      },
    },
    {
      name: "seasons",
      label: "Seasons",
      type: "relationship",
      relationTo: "seasons",
      hasMany: true,
    },
  ],
  hooks: {
    //    afterRead: [afterReadSeasons],
    //    beforeValidate: [beforeValidateSeasons],
  },
};
