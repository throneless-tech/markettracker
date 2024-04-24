import { CollectionConfig } from "payload/types";
import { withFormContext } from "../../utils/withFormContext";
import { MarketReportsEdit } from "../../components/MarketReports/MarketReportsEdit";
import { MarketReportsList } from "../../components/MarketReports/MarketReportsList";
import { createSalesReports } from "./hooks/createSalesReports";

export const MarketReports: CollectionConfig = {
  slug: "market-reports",
  admin: {
    components: {
      views: {
        Edit: withFormContext(MarketReportsEdit),
        List: withFormContext(MarketReportsList),
      },
    },
    pagination: {
      defaultLimit: 20,
    },
    useAsTitle: "name",
  },
  hooks: {
    afterChange: [createSalesReports],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "market",
      label: "Market",
      type: "relationship",
      relationTo: "markets",
    },
    {
      name: "season",
      label: "Season",
      type: "relationship",
      relationTo: "seasons",
    },
    {
      name: "operator",
      label: "Operator",
      type: "relationship",
      relationTo: "contacts",
    },
    {
      name: "date",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMM yyy",
        },
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          name: "vendorAttendance",
          label: "Vendor Attendance",
          fields: [
            {
              name: "vendorAttendance",
              type: "array",
              fields: [
                {
                  name: "vendor",
                  label: "Vendor",
                  type: "relationship",
                  relationTo: "vendors",
                },
                {
                  name: "status",
                  label: "Status",
                  type: "select",
                  defaultValue: "undetermined",
                  options: [
                    {
                      label: "Present with coupons",
                      value: "presentCoupons",
                    },
                    {
                      label: "Present, no coupons",
                      value: "present",
                    },
                    {
                      label: "Late with coupons",
                      value: "lateCoupons",
                    },
                    {
                      label: "Late, no coupons",
                      value: "late",
                    },
                    {
                      label: "Absent",
                      value: "absent",
                    },
                    {
                      label: "Undetermined",
                      value: "undetermined",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "customerAttendance",
          label: "Customer Attendance",
          fields: [
            {
              name: "customerAttendance",
              type: "array",
              fields: [
                {
                  name: "startTime",
                  label: "Start Time",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "timeOnly",
                    },
                  },
                },
                {
                  name: "endTime",
                  label: "End Time",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "timeOnly",
                    },
                  },
                },
                {
                  name: "count",
                  label: "Customer Count",
                  type: "number",
                  defaultValue: 0,
                },
              ],
            },
          ],
        },
        {
          name: "couponSales",
          label: "Coupon Sales",
          fields: [
            {
              name: "couponSales",
              type: "array",
              fields: [
                {
                  name: "vendor",
                  type: "relationship",
                  relationTo: "vendors",
                },
                {
                  label: "Fill in Amount of Coupons Redeemed",
                  type: "collapsible",
                  fields: [
                    {
                      name: "snap",
                      label: "SNAP",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of PURPLE coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                    {
                      name: "snapBonus",
                      label: "SNAP Bonus",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of WHITE and BLUE coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                    {
                      name: "marketGoods",
                      label: "Market Goods/Gift",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of YELLOW coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                    {
                      name: "wic",
                      label: "WIC/Senior",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of RED coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                    {
                      name: "credit",
                      label: "Credit/Debt Card",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of ORANGE coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                    {
                      name: "gworld",
                      label: "GWorld",
                      type: "number",
                      defaultValue: 0,
                      admin: {
                        description:
                          "Enter the sum total of GREEN coupons redeemed",
                        placeholder: "$0",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "quality",
          label: "Quality & Notes",
          fields: [
            {
              name: "weather",
              label: "How was the weather at the market?",
              type: "select",
              hasMany: true,
              options: [
                {
                  label: "Sunny",
                  value: "sunny",
                },
                {
                  label: "Hot",
                  value: "hot",
                },
                {
                  label: "Partly Cloudy",
                  value: "partly_cloudy",
                },
                {
                  label: "Cloudy",
                  value: "cloudy",
                },
                {
                  label: "Stormy",
                  value: "stormy",
                },
                {
                  label: "Raining",
                  value: "raining",
                },
                {
                  label: "Snowing",
                  value: "snowing",
                },
                {
                  label: "Icy",
                  value: "icy",
                },
                {
                  label: "Cold",
                  value: "cold",
                },
              ],
              admin: {
                description: "Click all that apply",
              },
            },
            {
              name: "engagement",
              label: "Describe community engagement activities",
              type: "group",
              fields: [
                {
                  name: "isMusicalGuest",
                  label: "Musical Guest",
                  type: "checkbox",
                },
                {
                  name: "musicalGuest",
                  type: "text",
                  admin: {
                    condition: (_, siblingData) => siblingData.isMusicalGuest,
                    placeholder: "Name",
                  },
                },
                {
                  name: "rateMusicalGuest",
                  label: "Rate the performance",
                  type: "radio",
                  options: [
                    {
                      label: "Very Poor",
                      value: "very_poor",
                    },
                    {
                      label: "Poor",
                      value: "poor",
                    },
                    {
                      label: "Average",
                      value: "average",
                    },
                    {
                      label: "Good",
                      value: "good",
                    },
                    {
                      label: "Very Good",
                      value: "very_good",
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData.isMusicalGuest,
                  },
                },
                {
                  name: "isOtherEntertainment",
                  label: "Other Entertainment",
                  type: "checkbox",
                },
                {
                  name: "otherEntertainment",
                  type: "text",
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData.isOtherEntertainment,
                    placeholder: "Name",
                  },
                },
                {
                  name: "rateOtherEntertainment",
                  label: "Rate the performance",
                  type: "radio",
                  options: [
                    {
                      label: "Very Poor",
                      value: "very_poor",
                    },
                    {
                      label: "Poor",
                      value: "poor",
                    },
                    {
                      label: "Average",
                      value: "average",
                    },
                    {
                      label: "Good",
                      value: "good",
                    },
                    {
                      label: "Very Good",
                      value: "very_good",
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData.isOtherEntertainment,
                  },
                },

                {
                  name: "isCookingDemo",
                  label: "Cooking Demo",
                  type: "checkbox",
                },
                {
                  name: "cookingDemo",
                  type: "text",
                  admin: {
                    condition: (_, siblingData) => siblingData.isCookingDemo,
                    placeholder: "Name",
                  },
                },
                {
                  name: "rateCookingDemo",
                  label: "Rate the performance",
                  type: "radio",
                  options: [
                    {
                      label: "Very Poor",
                      value: "very_poor",
                    },
                    {
                      label: "Poor",
                      value: "poor",
                    },
                    {
                      label: "Average",
                      value: "average",
                    },
                    {
                      label: "Good",
                      value: "good",
                    },
                    {
                      label: "Very Good",
                      value: "very_good",
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData.isCookingDemo,
                  },
                },
                {
                  name: "isOtherEducational",
                  label: "Other Educational",
                  type: "checkbox",
                },
                {
                  name: "otherEducational",
                  type: "text",
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData.isOtherEducational,
                    placeholder: "Name",
                  },
                },
                {
                  name: "rateOtherEducational",
                  label: "Rate the performance",
                  type: "radio",
                  options: [
                    {
                      label: "Very Poor",
                      value: "very_poor",
                    },
                    {
                      label: "Poor",
                      value: "poor",
                    },
                    {
                      label: "Average",
                      value: "average",
                    },
                    {
                      label: "Good",
                      value: "good",
                    },
                    {
                      label: "Very Good",
                      value: "very_good",
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData.isOtherEducational,
                  },
                },
                {
                  name: "isInformational",
                  label: "Informational/Community",
                  type: "checkbox",
                },
                {
                  name: "informational",
                  type: "text",
                  admin: {
                    condition: (_, siblingData) => siblingData.isInformational,
                    placeholder: "Name",
                  },
                },
                {
                  name: "rateInformational",
                  label: "Rate the performance",
                  type: "radio",
                  options: [
                    {
                      label: "Very Poor",
                      value: "very_poor",
                    },
                    {
                      label: "Poor",
                      value: "poor",
                    },
                    {
                      label: "Average",
                      value: "average",
                    },
                    {
                      label: "Good",
                      value: "good",
                    },
                    {
                      label: "Very Good",
                      value: "very_good",
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData.isInformational,
                  },
                },
                {
                  name: "otherActivities",
                  label: "Describe any other activities or additional details",
                  type: "textarea",
                  admin: {
                    placeholder: "start typing...",
                  },
                },
              ],
              admin: {
                description: "Click all that apply",
              },
            },
            {
              name: "needs",
              label: "Report Inventory Needs",
              type: "array", // TODO custom field
              fields: [
                {
                  name: "item",
                  type: "relationship",
                  relationTo: "supplies",
                },
                {
                  name: "quantity",
                  type: "number",
                  admin: {
                    placeholder: "QNTY",
                  },
                },
              ],
            },
            {
              name: "otherNeeds",
              label:
                "Describe any additional inventory needs or additional details",
              type: "textarea",
              admin: {
                placeholder: "start typing...",
              },
            },
          ],
        },
      ],
    },
  ],
};
