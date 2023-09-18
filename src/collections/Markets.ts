import { CollectionConfig } from "payload/types";
import CustomMarketsEdit from "../components/Markets/CustomMarketsEdit";
import CustomMarketsList from "../components/Markets/CustomMarketsList";

export const Markets: CollectionConfig = {
  slug: "markets",
  admin: {
    components: {
      views: {
        // Edit: CustomMarketsEdit,
        // List: CustomMarketsList,
      },
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
      label: "Market Manager",
      type: "relationship",
      relationTo: "contacts",
      required: true,
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
      name: "time",
      label: "Market Time",
      type: "group",
      fields: [
        {
          name: "startTime",
          label: "Start time",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
          },
        },
        {
          name: "endTime",
          label: "End time",
          type: "date",
          required: true,
          admin: {
            date: {
              pickerAppearance: "timeOnly",
            },
          },
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
      name: "type",
      label: "What type of market is it?",
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
    },
  ],
};
